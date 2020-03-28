const {blockchainController, networkController} = require('./Controllers/index');

module.exports = (app) => {
  app.get('/blockchain', blockchainController.get.blockchain);
  app.get('/mine', blockchainController.get.mine);

  app.post('/transaction', blockchainController.post.transaction);
  app.post('/register-and-broadcast-node', networkController.post.registerAndBroadcastNode);
  app.post('/register-node', networkController.post.registerNode);
  app.post('/register-nodes-bulk', networkController.post.registerNodesBulk);
};