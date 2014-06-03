'use strict';

var _ = require('lodash');
var Q = require('q');
var agentQ = require('qagent');
var request = require('superagent');


function Method(url, method, endpoint) {
  this.method = method;
  this.endpoint = endpoint;
  this.headers = {};

  this._url = url || this.endpoint._url;

  return this;
}

Method.prototype.header = function(headerKey, headerValue) {
  this.headers[headerKey] = headerValue;

  return this;
};

Method.prototype.url = function(url) {
  this._url = url;

  return this;
};

Method.prototype.merge = function(defaults, overrides) {
  return _.extend({}, defaults, overrides);
};

Method.prototype.data = function(data) {
  this._data = data;

  return this;
};

Method.prototype.send = function() {
  var deferred = Q.defer();
  var requestObject = this.createRequestObject();

  agentQ.end(requestObject)
  .then(deferred.resolve, deferred.reject)
  .done();

  return deferred.promise;
};

Method.prototype.createRequestObject = function() {
  var requestObject = request[this.method](this._url);
  var headers = this.merge(this.endpoint.headers, this.headers);

  if(this._data) {
    requestObject.send(this._data);
  }

  _.each(headers, function(headerValue, headerName) {
    requestObject.set(headerName, headerValue);
  }, this);

  return requestObject;
};

module.exports = Method;
