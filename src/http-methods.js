'use strict';

var Method = require('./http-method');


var methodFactory = function(methodString) {
  var httpMethod = function() {
    return new Method(methodString, this);
  };

  return httpMethod;
};

var httpMethods = {};

httpMethods.head = methodFactory('head');
httpMethods.options = methodFactory('options');
httpMethods.get = methodFactory('get');
httpMethods.post = methodFactory('post');
httpMethods.put = methodFactory('put');
httpMethods.patch = methodFactory('patch');
httpMethods.delete = methodFactory('delete');

module.exports = httpMethods;
