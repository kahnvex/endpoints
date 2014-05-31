'use strict';

var request = require('superagent');
var agentQ = require('agent-q');
var Q = require('q');
var _ = require('lodash');

function MethodFactory(url, method, endpoint) {
  this.url = url;
  this.method = method;
  this.endpoint = endpoint;

  return this.init();
}

MethodFactory.prototype.init = function() {
  this.url = this.url || this.endpoint.url;
  this.requestObject = this.createRequestObject(this.url);

  this.deferred = Q.defer();

  return this;
};

MethodFactory.prototype.header = function(headerKey, headerValue) {
  this.requestObject.set(headerKey, headerValue);
  return this;
};

MethodFactory.prototype.send = function() {
  var handleResponse = _.bind(this._handleResponse, this);
  var reject = _.bind(this._reject, this);

  agentQ.end(this.requestObject)
  .then(handleResponse, reject)
  .done();

  return this.deferred.promise;
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
MethodFactory.prototype._handleResponse = function(res) {
  if(res.xhr.status > 299) {
    this.deferred.reject(res.xhr);
    return;
  }

  if(_.contains(['get', 'post', 'put', 'patch'], this.method)) {
    this.endpoint.data = JSON.parse(res.xhr.response);
  }

  this.deferred.resolve(this.endpoint);
};

MethodFactory.prototype._reject = function(error) {
  this.deferred.reject(error);
};


var httpMethods = {};

var methodFactory = function(methodString) {
  var httpMethod = function(url) {
    return new MethodFactory(url, methodString, this);
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
