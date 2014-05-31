'use strict';

var request = require('superagent');
var agentQ = require('agent-q');
var Q = require('q');
var _ = require('lodash');

function MethodFactory(url, method, endpoint) {
  this.url = url;
  this.method = method;
  this.endpoint = endpoint;

  this.init();
}

MethodFactory.prototype.init = function() {
  var url = this.url || this.endpoint.url;
  var handleResponse = _.bind(this.handleResponse, this);
  var reject = _.bind(this.reject, this);
  var requestObject = this.createRequestObject(url);

  this.deferred = Q.defer();

  agentQ.end(requestObject)
  .then(handleResponse, reject)
  .done();
};

MethodFactory.prototype.createRequestObject = function(url) {
  var requestObject = request[this.method](url);

  if(_.contains(['post', 'patch', 'put'], this.method)) {
    requestObject.send(this.endpoint.data);
  }

  _.each(this.endpoint.headers, function(headerValue, headerName) {
    requestObject.set(headerName, headerValue);
  }, this);

  return requestObject;
};

/* heandeResponse takes a response object
 * - if the response code is not in the 200 range the promise is rejected
 *   - and given the xhr response
 * - else the response body is parsed into the data proerty of the endpoint
 */
MethodFactory.prototype.handleResponse = function(res) {
  if(res.xhr.status > 299) {
    this.deferred.reject(res.xhr);
    return;
  }

  if(_.contains(['get', 'post', 'put', 'patch'], this.method)) {
    this.endpoint.data = JSON.parse(res.xhr.response);
  }

  this.deferred.resolve(this.endpoint);
};

MethodFactory.prototype.reject = function(error) {
  this.deferred.reject(error);
};

MethodFactory.prototype.promise = function() {
  return this.deferred.promise;
};


var httpMethods = {};

var methodFactory = function(methodString) {

  // TODO: Factor logic into helper class(es)
  // Things here are going to get crazy
  var httpMethod = function(url) {
    var method = new MethodFactory(url, methodString, this);
    return method.promise();
  };

  return httpMethod;
};

httpMethods.head = methodFactory('head');
httpMethods.options = methodFactory('options');
httpMethods.get = methodFactory('get');
httpMethods.post = methodFactory('post');
httpMethods.put = methodFactory('put');
httpMethods.patch = methodFactory('patch');
httpMethods.delete = methodFactory('delete');

module.exports = httpMethods;
