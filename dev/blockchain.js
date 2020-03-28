const sha256 = require('sha256');

class Blockchain {
  constructor() {
    // Storage for blocks that are created/mined
    this.chain = [];
    // Storage for created transactions before placed in a block/mined
    this.newTransactions = [];
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

  createNewBlock (nonce, hash, previousHash) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.newTransactions,
      // Number, legitimate block creation (proofOfWork)
      nonce,
      // Hashed newTransactions
      hash,
      // Hashed data from previous block
      previousHash
    };

    this.newTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  };

  createNewTransaction (amount, sender, recipient) {
    const newTransaction = {
      amount,
      sender,
      recipient
    };

    this.newTransactions.push(newTransaction);

    return this.getLastBlock()['amount'] + 1;
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
}

module.exports = Blockchain;