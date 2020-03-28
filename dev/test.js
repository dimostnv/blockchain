const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

const previousBlockHash = 'FCGVHJBKNL';
const currentBlockData = [
  {
    amount: 222,
    sender: 'SDASDASD',
    recipient: 'ASDASD'
  },
  {
    amount: 223,
    sender: 'ASDASD',
    recipient: 'JKLJL'
  },
  {
    amount: 226,
    sender: 'VBNM',
    recipient: 'RTYUIOP'
  },
  {
    amount: 227,
    sender: '@:LKJH',
    recipient: 'QWERTY'
  },
];

console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData));