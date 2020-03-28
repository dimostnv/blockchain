const express = require('express');

const {port} = require('./Config/config');
const appConfig = require('./Config/express-config');
const addRoutes = require('./routes');

const app = express();

appConfig(app);
addRoutes(app);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});