'use strict';

var request = require('superagent');
var agentQ = require('agent-q');
var Q = require('q');
var _ = require('lodash');


function MethodFactory(url, method, endpoint) {
  this.method = method;
  this.endpoint = endpoint;
  this.headers = {};

  this._url = url || this.endpoint._url;

  this.deferred = Q.defer();

  return this;
}

MethodFactory.prototype.header = function(headerKey, headerValue) {
  this.headers[headerKey] = headerValue;

  return this;
};

MethodFactory.prototype.url = function(url) {
  this._url = url

  return this;
};

MethodFactory.prototype.merge = function(defaults, overrides) {
  return _.extend({}, defaults, overrides);
};

MethodFactory.prototype.data = function(data) {
  this.endpoint.data = data;

  return this;
};

MethodFactory.prototype.send = function() {
  var handleResponse = _.bind(this._handleResponse, this);
  var reject = _.bind(this._reject, this);
  var requestObject = this.createRequestObject();

  agentQ.end(requestObject)
  .then(handleResponse, reject)
  .done();

  return this.deferred.promise;
};

MethodFactory.prototype.createRequestObject = function() {
  var requestObject = request[this.method](this._url);
  var headers = this.merge(this.endpoint.headers, this.headers);

  if(_.contains(['post', 'patch', 'put'], this.method)) {
    requestObject.send(this.endpoint.data);
  }

  _.each(headers, function(headerValue, headerName) {
    requestObject.set(headerName, headerValue);
  }, this);

  return requestObject;
};

/* heandeResponse takes a response object
 * - if the response code is not in the 200 range the promise is rejected
 *   - and given the xhr response
 * - else the response body is parsed into the data proerty of the endpoint
 */
MethodFactory.prototype._handleResponse = function(response) {
  if(response.xhr.status > 299) {
    this.deferred.reject(response.xhr);
    return;
  }

  if(_.contains(['get', 'post', 'put', 'patch'], this.method)) {
    this.endpoint.data = JSON.parse(response.xhr.response);
  }

  this.deferred.resolve(this.endpoint);
};

MethodFactory.prototype._reject = function(error) {
  this.deferred.reject(error);
};

module.exports = MethodFactory;
