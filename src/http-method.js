'use strict';

var _ = require('lodash');
var agentQ = require('qagent');
var request = require('superagent');


function Method(method, endpoint) {
  this.method = method;
  this.endpoint = endpoint;
  this.headers = {};
  this.params = {};
  this._promisePermutations = this.endpoint._promisePermutations;

  return this;
}

Method.prototype.header = function(headerKey, headerValue) {
  this.headers[headerKey] = headerValue;

  return this;
};

Method.prototype.param = function(key, value) {
  this.params[key] = value;

  return this;
};

Method.prototype.buildUrl = function() {
  var domain = this.endpoint.getDomain();
  var pattern = this.endpoint.getPattern();
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

Method.prototype.merge = function(defaults, overrides) {
  return _.extend({}, defaults, overrides);
};

Method.prototype.data = function(data) {
  this._data = data;

  return this;
};

Method.prototype.query = function(query) {
  this._query = query;

  return this;
};

Method.prototype.promiseApply = function(permutationFunction) {
  this._promisePermutations.push(permutationFunction);

  return this;
};

Method.prototype.send = function() {
  var requestObject = this.createRequestObject();

  var promise = agentQ.end(requestObject);

  _.each(this._promisePermutations, function(permutationFunction) {
    promise = promise.then(permutationFunction);
  });

  return promise;
};

Method.prototype.createRequestObject = function() {
  var url = this.buildUrl();
  var requestObject = request[this.method](url);
  var headers = this.merge(this.endpoint.headers, this.headers);

  if(this._data) {
    requestObject.send(this._data);
  }

  if(this._query) {
    requestObject.query(this._query);
  }

  _.each(headers, function(headerValue, headerName) {
    requestObject.set(headerName, headerValue);
  }, this);

  return requestObject;
};

module.exports = Method;
