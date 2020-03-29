const express = require('express');

const {blockchainController} = require('../Controllers/index');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile('index.html', {root: __basedir});
});
router.get('/block/:blockHash', blockchainController.get.block);
router.get('/transaction/:transactionId', blockchainController.get.transaction);
router.get('/account/:address', blockchainController.get.account);

module.exports = router;