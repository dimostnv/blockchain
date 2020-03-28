const express = require('express');

const {port} = require('./config');
const addRoutes = require('./routes');

const app = express();

addRoutes(app);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});