'use strict';

var request = require('superagent');
var _ = require('lodash');
var agentQ = require('qagent');
var genDeferred = require('./gen-deferred');


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
  this.endpoint.data = data;

  return this;
};

Method.prototype.massageResponse = function(_response) {
  var response = {};

  if(_response.xhr) {
    /* Browser like response */
    response.all = _response.xhr;
    response.status = _response.xhr.status;

    if(response.status < 300) {
      response.body = JSON.parse(_response.xhr.response);
    }

    return response;
  }

  /* Node like response */
  response.all = _response.res;
  response.body = _response.res.body;
  response.status = _response.res.statusCode;

  return response;
};

Method.prototype.send = function() {
  var d = genDeferred();
  var requestObject = this.createRequestObject();

  var handleResponse = function(data) {
    var responseBody;
    var response = this.massageResponse(data);
    var status;

    if(response.status > 299) {
      d.reject(response.all);
      return;
    }

    if(_.contains(['get', 'post', 'put', 'patch'], this.method)) {
      this.endpoint.data = response.body;
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

Method.prototype.createRequestObject = function() {
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

module.exports = Method;
