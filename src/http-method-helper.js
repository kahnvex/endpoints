'use strict';

var Method = require('./http-method');


var methodHelper = function(methodString) {
  var httpMethod = function() {
    return new Method(methodString, this);
  };

  return httpMethod;
};

module.exports = methodHelper;
