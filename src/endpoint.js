'use strict';

var httpMethodHelper = require('./http-method-helper');
var requestAdapter = require('requestadapter');
var httpConfigurable = require('./http-configurable');
var _ = require('lodash');
var Q = require('q');
Q.longStackSupport = true;

function Endpoint(pattern) {
  var passThroughError = function(error) {
    throw error;
  };

  var passThrough = function(value) {
    return value;
  };

  // An endpoint is httpConfigurable so initialize it as such
  this.initHttpConfigurable();
  this.thenApply(requestAdapter, passThroughError, passThrough);
  pattern = pattern || '';
  pattern  = this.removeLeadingSlash(pattern);
  this._pattern = pattern.split('/');
  this._domain = '';
}

Endpoint.prototype.pattern = function(pattern) {
  pattern = this.removeLeadingSlash(pattern);
  this._pattern = pattern.split('/');

  return this;
};

Endpoint.prototype.domain = function(domain) {
  this.setDomain(domain);

  return this;
};

Endpoint.prototype.methods = function(methodList){
  var method;

  var createMethod = function(methodString){
    // Attach the method to the endpoint
    this[methodString] = httpMethodHelper(methodString, this);
    method = this[methodString];

    // Methods are HTTP configurable so extend the method with
    // the httpConfigurable mixin and initialize it.
    _.extend(method, httpConfigurable);
    method.initHttpConfigurable();
  };

  if(_.isString(methodList)) {
    methodList = [methodList];
  }

  _.each(methodList, createMethod, this);

  return this;
};

Endpoint.prototype.getDomain = function() {
  return this._domain;
};

Endpoint.prototype.setDomain = function(domain) {
  this._domain = domain;

  if(this._domain.substr(-1) === '/') {
    this._domain = this._domain.substr(0, this._domain.length - 1);
  }
};

Endpoint.prototype.getPattern = function() {
  return this._pattern;
};

Endpoint.prototype.removeLeadingSlash = function(string) {
  if(string[0] === '/') {
    return string.substr(1);
  }

  return string;
};

// Endpoints are HTTP configurable so extend Endpoint.prototype with
// the httpConfigurable mixin
_.extend(Endpoint.prototype, httpConfigurable);

module.exports = Endpoint;
