const bitcoin = require('./controller');

module.exports = (app) => {
  app.get('/blockchain', bitcoin.get.blockchain);

  app.post('/transaction', bitcoin.post.transaction);

  app.get('/mine', bitcoin.get.mine);
};