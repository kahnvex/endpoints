'use strict';

var request = require('superagent');
var agentQ = require('qagent');
var Q = require('q');
var _ = require('lodash');


var wrapResponses = function(methodObj) {
  var deferred = Q.defer();

  var _reject = function(error) {
    deferred.reject(error);
  };

  var _handleResponse = function(response) {
    if(response.xhr.status > 299) {
      deferred.reject(response.xhr);
      return;
    }

    if(_.contains(['get', 'post', 'put', 'patch'], methodObj.method)) {
      methodObj.endpoint.data = JSON.parse(response.xhr.response);
    }

    deferred.resolve(methodObj.endpoint);
  };

  return {
    deferred: deferred,
    reject: _reject,
    handleResponse: _handleResponse
  };
};

function MethodFactory(url, method, endpoint) {
  this.method = method;
  this.endpoint = endpoint;
  this.headers = {};

  this._url = url || this.endpoint._url;

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
  var callbacks = wrapResponses(this);
  var requestObject = this.createRequestObject();

  agentQ.end(requestObject)
  .then(callbacks.handleResponse, callbacks.reject)
  .done();

  return callbacks.deferred.promise;
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

module.exports = MethodFactory;
