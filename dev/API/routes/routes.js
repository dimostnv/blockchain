const userRouter = require('../routes/user-router');
const {blockchainController, networkController} = require('../Controllers');

module.exports = (app) => {
  app.use(userRouter);
  app.get('/blockchain', blockchainController.get.blockchain);
  app.get('/mine', blockchainController.get.mine);
  app.get('/consensus', blockchainController.get.consensus);

  app.post('/transaction', blockchainController.post.transaction);
  app.post('/transaction/broadcast', blockchainController.post.transactionAndBroadcast);
  app.post('/receive-new-block', blockchainController.post.newBlock);
  app.post('/register-and-broadcast-node', networkController.post.registerAndBroadcastNode);
  app.post('/register-node', networkController.post.registerNode);
  app.post('/register-nodes-bulk', networkController.post.registerNodesBulk);
};