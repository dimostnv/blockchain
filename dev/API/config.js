const environment = process.env.NODE_ENV || 'development';

const endpoint = {
  development: {
    port: 3000
  },
  production: {}
};

module.exports = endpoint[environment];