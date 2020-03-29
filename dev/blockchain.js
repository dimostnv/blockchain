const sha256 = require('sha256');
const uuid = require('uuid');
const currentNodeUrl = process.argv[3];

class Blockchain {
  constructor() {
    // Storage for blocks that are created/mined
    this.chain = [];
    // Storage for created transactions before placed in a block/mined
    this.newTransactions = [];
    // URL of current blockchain node
    this.currentNodeUrl = currentNodeUrl;
    // Nodes of blockchain network
    this.networkNodes = [];
    // Generate Genesis Block
    this.createNewBlock(100, '0', '0');
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  };

  hashBlock(previousBlockHash, blockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(blockData);
    return sha256(dataAsString);
  }

  createNewBlock (nonce, hash, previousBlockHash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.newTransactions,
      // Number, legitimate block creation (proofOfWork)
      nonce,
      // Hashed newTransactions
      hash,
      // Hashed data from previous block
      previousBlockHash
    };

    this.newTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  };

  createNewTransaction (amount, sender, recipient) {
    return {
      transactionId: uuid.v1().split('-').join(''),
      amount,
      sender,
      recipient
    };
  }

  addNewTransaction(transaction) {
    this.newTransactions.push(transaction);

    return this.getLastBlock()['index'] + 1;
  }

  proofOfWork (previousBlockHash, blockData) {
    // Derive the nonce value that results in a correct data hash (starting with 0000)
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, blockData, nonce);

    while (hash.substring(0, 4) !== '0000') {
      nonce++;
      hash = this.hashBlock(previousBlockHash, blockData, nonce);
    }

    return nonce;
  }

  isValid (chain) {
    // A chain is valid if blocks are hashed correctly, have the correct data and the correct genesis block
    let isValid = true;

    // Genesis block validation
    const genesisBlockIsValid =
      chain[0].nonce === 100
      && chain[0].hash === '0'
      && chain[0].previousBlockHash === '0';

    for (let i = 1; i < chain.length; i++) {
      const prevBlock = chain[i-1];
      const currBlock = chain[i];
      // Hash validation
      const hashIsValid = prevBlock.hash === currBlock.previousBlockHash;
      // Data validation
      const currBlockData = {
        transactions: currBlock.transactions,
        index: currBlock.index
      };
      const blockHash = this.hashBlock(currBlock.previousBlockHash, currBlockData, currBlock.nonce);
      const dataIsValid = blockHash.substring(0, 4) === '0000';


      if (!genesisBlockIsValid || !hashIsValid || !dataIsValid) {
        isValid = false;
      }
    }

    return isValid;
  }
}

module.exports = Blockchain;