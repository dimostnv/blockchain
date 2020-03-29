const bitcoin = require('../Config/bitcoin-config');
const rp = require('request-promise');

const networkController = {
  post: {
    registerAndBroadcastNode: function (req, res) {
      const {newNodeUrl} = req.body;
      // Register new node on network, if not existent
      if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
        bitcoin.networkNodes.push(newNodeUrl);
      }
      // Broadcast new node to other network nodes
      const registerNodePromises = [];
      bitcoin.networkNodes.forEach((node) => {
        const requestOptions = {
          uri: node + '/register-node',
          method: 'POST',
          body: {newNodeUrl},
          json: true
        };

        registerNodePromises.push(rp(requestOptions));
      });

      Promise.all(registerNodePromises)
        .then(() => {
          // Register other nodes at new node
          const registerBulkOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {networkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]},
            json: true
          };

          return rp(registerBulkOptions);
        })
        .then(() => {
          res.json({node: `New node registered with network successfully`});
        }).catch((err) => console.log(err.message));
    },
    registerNode: function (req, res) {
      const {newNodeUrl} = req.body;

      if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1
        && bitcoin.currentNodeUrl !== newNodeUrl) {
        bitcoin.networkNodes.push(newNodeUrl);
      }

      res.json({node: 'New node registered successfully'});
    },
    registerNodesBulk: function (req, res) {
      const {networkNodes} = req.body;

      networkNodes.forEach((node) => {
        if (bitcoin.networkNodes.indexOf(node) === -1 && bitcoin.currentNodeUrl !== node) {
          bitcoin.networkNodes.push(node);
        }
      });

      res.json({note: 'Bulk node registration successful'});
    }
  }
};

module.exports = networkController;