'use strict';

var request = require('superagent');
var _ = require('lodash');
var Q = require('q');
var agentQ = require('qagent');
var genDeferred = require('./gen-deferred');


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
  var d = genDeferred();
  var requestObject = this.createRequestObject();

  var handleResponse = function(data) {
    var responseBody;
    var response;
    var status;

    if(data.xhr) {
      /* Browser like response */
      response = data.xhr;
      responseBody = data.xhr.response;
      status = data.xhr.status;
    } else {
      /* Node like response */
      response = data.res;
      responseBody = data.res.body;
      status = data.res.statusCode;
    }

    if(status > 299) {
      d.reject(response);
      return;
    }

    if(data.xhr) {
      responseBody = JSON.parse(responseBody);
    }

    if(_.contains(['get', 'post', 'put', 'patch'], this.method)) {
      this.endpoint.data = responseBody;
    }

    d.resolve(this.endpoint);
  };

  var reject = function(error) {
    d.reject(error);
  };

  agentQ.end(requestObject)
  .then(_.bind(handleResponse, this), reject)
  .done();

  return d.promise;
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
