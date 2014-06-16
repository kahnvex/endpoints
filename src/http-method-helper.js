'use strict';

var Method = require('./http-method');
var _ = require('lodash');


var methodHelper = function(methodString, endpoint) {
  var httpMethod = function() {
    // Concatenate the Endpoint's thenApplies with the methods thenApplies,
    // such that the order goes from the Endpoint's thenApplies to the
    // method's thenApplies. Ordering from most general to most specific.

    var thenApplies = endpoint.thenApplies.concat(
      endpoint[methodString].thenApplies);

    var headers = _.extend({}, endpoint.headers,
      endpoint[methodString].headers);

    var endpointConfig = {
      headers: headers,
      thenApplies: thenApplies,
      domain: endpoint.getDomain(),
      pattern: endpoint.getPattern(),
    };
    return new Method(methodString, endpointConfig);
  };

  return httpMethod;
};

module.exports = methodHelper;
