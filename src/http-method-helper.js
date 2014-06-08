'use strict';

var Method = require('./http-method');


var methodHelper = function(methodString) {
  var httpMethod = function() {
    var endpoint = this;
    var endpointConfig = {
      headers: endpoint.headers,
      thenApplies: endpoint.thenApplies,
      domain: endpoint.getDomain(),
      pattern: endpoint.getPattern(),

    };
    return new Method(methodString, endpointConfig);
  };

  return httpMethod;
};

module.exports = methodHelper;
