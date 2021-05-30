const express = require('express');
const Logger = require('../utils/logger');
const helper = require('../utils/helper');

const logger = new Logger('Http');

function HttpServer() {
  this.version = '1.0.0';
  this.app = express();
  this.server = null;
}

HttpServer.prototype.start = function (port = 8080) {
  try {
    this.server = server = this.app.listen(port, () => {
      logger.success('Listening localhost on port ', this.server.address().port);
    });
  }
  catch (e) {
    logger.error(e);
  }
}
// 注册路由
HttpServer.prototype.route = function (method, uri, response) {
  this.app[method](uri, function (req, res) {
    let responseType = helper.getTypeOf(response);
    if (['Number', 'String', 'Array', 'Object'].includes(responseType)) {
      res.send(response);
      return;
    }
    if (responseType === 'Function') {
      res.send(response(req));
      return;
    }
  });
}

module.exports = HttpServer;