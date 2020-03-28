const environment = process.env.NODE_ENV || 'development';

const endpoint = {
  development: {
    port: process.argv[2]
  },
  production: {}
};

module.exports = endpoint[environment];