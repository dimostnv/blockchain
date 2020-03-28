module.exports = (app) => {
  app.get('/blockchain', (req, res) => {
    res.send('Hello world')
  });

  app.post('/transaction');

  app.get('/mine');
};