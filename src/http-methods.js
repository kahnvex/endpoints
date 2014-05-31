'use strict';

var MethodFactory = require('./method-factory');


var methodFactory = function(methodString) {
  var httpMethod = function(url) {
    return new MethodFactory(url, methodString, this);
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
