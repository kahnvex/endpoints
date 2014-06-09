'use strict';

var _ = require('lodash');
var agentQ = require('qagent');
var request = require('superagent');


function Method(method, endpointConfig) {
  this.params = {};
  this.method = method;
  this.headers = endpointConfig.headers || {};
  this.thenApplies = endpointConfig.thenApplies || [];
  this.domain = endpointConfig.domain || '';
  this.pattern = endpointConfig.pattern || '/';

  return this;
}

Method.prototype.header = function(headerKey, headerValue) {
  this.headers[headerKey] = headerValue;

  return this;
};

Method.prototype.contentType = function(mimeType) {
  return this.header('Content-Type', mimeType);
};

Method.prototype.accepts = function(mimeType) {
  return this.header('Accepts', mimeType);
};

Method.prototype.param = function(key, value) {
  this.params[key] = value;

  return this;
};

Method.prototype.buildUrl = function() {
  var domain = this.domain;
  var pattern = this.pattern;
  var urlArray = [domain];
  var urlString;

  var pathArray = _.map(pattern, function(pathPart) {

    _.each(this.params, function(paramValue, paramKey) {

      var pattern = '[' + paramKey + ']';
      if(pathPart.indexOf(pattern) > -1) {
        pathPart = pathPart.replace(pattern, paramValue, 'g');
      }

    });

    return pathPart;

  }, this);

  urlArray = urlArray.concat(pathArray);
  urlString  = urlArray.join('/');

  return urlString;
};

Method.prototype.data = function(data) {
  this._data = data;

  return this;
};

Method.prototype.query = function(query) {
  this._query = query;

  return this;
};

Method.prototype.thenApply = function(onFulfilled, onRejected, onProgress) {
  var thenApply = {
    onFulfilled: onFulfilled,
    onRejected: onRejected,
    onProgress: onProgress
  };

  this.thenApplies.push(thenApply);

  return this;
};

Method.prototype.send = function() {
  var requestObject = this.createRequestObject();

  var promise = agentQ.end(requestObject);

  _.each(this.thenApplies, function(thenApply) {
    promise = promise.then(
      thenApply.onFulfilled,
      thenApply.onRejected,
      thenApply.onProgress
    );
  });

  return promise;
};

Method.prototype.createRequestObject = function() {
  var url = this.buildUrl();
  var requestObject = request[this.method](url);

  if(this._data) {
    requestObject.send(this._data);
  }

  if(this._query) {
    requestObject.query(this._query);
  }

  _.each(this.headers, function(headerValue, headerName) {
    requestObject.set(headerName, headerValue);
  }, this);

  return requestObject;
};

module.exports = Method;
