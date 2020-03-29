const uuid = require('uuid');
const rp = require('request-promise');

const bitcoin = require('../Config/bitcoin-config');
const nodeAddress = uuid.v1().split('-').join('');

const blockchainController = {
  get: {
    blockchain: function (req, res) {
      return res.send(bitcoin);
    },
    mine: function (req, res) {
      const lastBlock = bitcoin.getLastBlock();

      const previousBlockHash = lastBlock['hash'];
      const currentBlockData = {
        transactions: bitcoin.newTransactions,
        index: lastBlock['index'] + 1
      };
      const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
      const blockhash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

      const newBlock = bitcoin.createNewBlock(nonce, blockhash, previousBlockHash);

      const requestPromises = [];
      bitcoin.networkNodes.forEach((node) => {
        const requestOptions = {
          uri: node + '/receive-new-block',
          method: 'POST',
          body: {newBlock},
          json: true
        };

        requestPromises.push(rp(requestOptions));
      });

      Promise.all(requestPromises)
        .then(() => {
          const requestOptions = {
            uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
              amount: 12.5,
              sender: '00',
              recipient: nodeAddress
            },
            json: true
          };

          return rp(requestOptions);
        })
        .then(() => {
          return res.json({
          note: 'New block mined and broadcast successfully',
          block: newBlock
        });
      });
    },
    consensus: function (req, res) {
      // Retrieve all chains from all nodes
      const requestPromises = [];
      bitcoin.networkNodes.forEach((node) => {
        const requestOptions = {
          uri: node + '/blockchain',
          method: 'GET',
          json: true
        };

        requestPromises.push(rp(requestOptions));
      });

      Promise.all(requestPromises)
        .then((blockchains) => {
          // Check if there is a longer chain than current node chain
          let maxChainLength = bitcoin.chain.length;
          let newChain, newTransactions;
          blockchains.forEach((blockchain) => {
            if (blockchain.chain.length > maxChainLength) {
              maxChainLength = blockchain.length;
              newChain = blockchain.chain;
              newTransactions = blockchain.newTransactions;
            }
          });
          // Modify blockchain if longer chain is available
          if (newChain && bitcoin.isValid(newChain)) {
            bitcoin.chain = newChain;
            bitcoin.newTransactions = newTransactions;
            res.json({
              note: 'Current chain has been replaced',
              chain: bitcoin.chain
            });
          } else {
            res.json({
              note: 'Current chain has not been replaced',
              chain: bitcoin.chain
            });
          }
        }).catch((err) => console.log(err.message));
    }
  },
  post: {
    transaction: function (req, res) {
      const newTransaction = req.body;
      const blockIndex = bitcoin.addNewTransaction(newTransaction);

      return res.json({note: `Transaction will be added in block ${blockIndex}`});
    },
    transactionAndBroadcast: function (req, res) {
      const {amount, sender, recipient} = req.body;
      const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient);
      bitcoin.addNewTransaction(newTransaction);

      const requestPromises = [];
      bitcoin.networkNodes.forEach((node) => {
        const requestOptions = {
          uri: node + '/transaction',
          method: 'POST',
          body: newTransaction,
          json: true
        };

        requestPromises.push(rp(requestOptions));
      });

      Promise.all(requestPromises)
        .then(() => {
          res.json({note: 'Transaction added and broadcast successfully'});
        }).catch((err) => console.log(err.message));
    },
    newBlock: function (req, res) {
      const {newBlock} = req.body;
      const lastBlock = bitcoin.getLastBlock();
      console.log(lastBlock);
      // Block validation
      const isValid = newBlock.previousBlockHash === lastBlock.hash && newBlock.index === lastBlock.index + 1;

      if (isValid) {
        bitcoin.chain.push(newBlock);
        bitcoin.newTransactions = [];
        res.json({
          note: 'New block received and accepted',
          newBlock
        });
      } else {
        res.json({
          note: 'New block rejected',
          newBlock
        });
      }
    }
  }
};

module.exports = blockchainController;