'use strict';

var $ = require('jquery');
var Q = require('q');
var qjax = require('qjax');


var httpMethods = {};

var methodHelper = function(method) {

  // TODO: Factor logic into helper class(es)
  // Things here are going to get crazy
  var httpMethod = function(options) {
    var deferred = Q.defer();

    var resolve = function(data) {
      if(method === 'GET' || method === 'POST' || method === 'PUT') {
        this.data = data;
      }

      deferred.resolve(this);
    };

    var reject = function(error) {
      deferred.reject(error);
    };

    options = $.extend({}, this.ajaxOptions, options);

    qjax.methodFactory(method)(options)
    .then(resolve.bind(this), reject.bind(this));

    return deferred.promise;
  };

  return httpMethod;
};

httpMethods.head = methodHelper('HEAD');
httpMethods.options = methodHelper('OPTIONS');
httpMethods.get = methodHelper('GET');
httpMethods.post = methodHelper('POST');
httpMethods.put = methodHelper('PUT');
httpMethods.patch = methodHelper('PATCH');
httpMethods.delete = methodHelper('DELETE');

module.exports = httpMethods;
