'use strict';

var httpMethodHelper = require('./http-method-helper');
var requestAdapter = require('requestadapter');
var httpConfigurable = require('./http-configurable');
var _ = require('lodash');
var Q = require('q');
Q.longStackSupport = true;

function Create(pattern) {
  var passThroughError = function(error) {
    throw error;
  };

  var passThrough = function(value) {
    return value;
  };

  this.thenApplies = [];
  this.thenApply(requestAdapter, passThroughError, passThrough);
  pattern = pattern || '';
  pattern  = this.removeLeadingSlash(pattern);
  this._pattern = pattern.split('/');
  this._domain = '';
}

Create.prototype.headers = {};

Create.prototype.pattern = function(pattern) {
  pattern = this.removeLeadingSlash(pattern);
  this._pattern = pattern.split('/');
};

Create.prototype.domain = function(domain) {
  this.setDomain(domain);

  return this;
};

Create.prototype.methods = function(methodList){
  if(_.isString(methodList)) {
    methodList = [methodList];
  }

  _.each(methodList, function(method){
    this[method] = httpMethodHelper(method, this);

    _.extend(this[method], httpConfigurable());
  }, this);

  return this;
};

Create.prototype.getDomain = function() {
  return this._domain;
};

Create.prototype.setDomain = function(domain) {
  this._domain = domain;

  if(this._domain.substr(-1) === '/') {
    this._domain = this._domain.substr(0, this._domain.length - 1);
  }
};

Create.prototype.getPattern = function() {
  return this._pattern;
};

Create.prototype.removeLeadingSlash = function(string) {
  if(string[0] === '/') {
    return string.substr(1);
  }

  return string;
};

_.extend(Create.prototype, httpConfigurable());

module.exports = Create;
