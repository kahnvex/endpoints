'use strict';

var httpMethods = require('./http-methods');
var _ = require('lodash');


function Create(url) {
  this._url = url;
}

Create.prototype.headers = {};

Create.prototype.url = function(url) {
  this._url = url;
};

Create.prototype.methods = function(methodList){
  _.each(methodList, function(method){
    this[method] = _.bind(httpMethods[method], this)();
  }, this);

  return this;
};

Create.prototype.header = function(headerKey, headerValue) {
  this.headers[headerKey] = headerValue;

  return this;
};

module.exports = Create;
