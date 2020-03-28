const Blockchain = require('../blockchain');
const uuid = require('uuid');

const bitcoin = new Blockchain();
const nodeAddress = uuid.v1().split('-').join('');

const bitcoinController = {
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

      bitcoin.createNewTransaction(12.5, '00', nodeAddress);

      const newBlock = bitcoin.createNewBlock(nonce, blockhash, previousBlockHash);

      return res.json({
        note: 'New block mined successfully',
        block: newBlock
      });
    }
  },
  post: {
    transaction: function (req, res) {
      const blockIndex =
        bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);

      return res.json({note: `Transaction will be added in block ${blockIndex}`});
    }
  }
};

module.exports = bitcoinController;