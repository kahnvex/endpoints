'use strict';

var httpMethods = require('./http-methods');
var _ = require('lodash');


function Create(pattern) {
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
  _.each(methodList, function(method){
    this[method] = _.bind(httpMethods[method], this);
  }, this);

  return this;
};

Create.prototype.header = function(headerKey, headerValue) {
  this.headers[headerKey] = headerValue;

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

module.exports = Create;
