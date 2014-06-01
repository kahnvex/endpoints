'use strict';

var httpMethods = require('./http-methods');
var _ = require('lodash');


function create(url) {
  this._url = url;

  return this;
}

create.prototype.headers = {};

create.prototype.url = function(url) {
  this._url = url;
};

create.prototype.methods = function(methodList){
  _.each(methodList, function(method){
    this[method] = _.bind(httpMethods[method], this);
  }, this);

  return this;
};

create.prototype.data = function(data) {
  this.data = data;

  return this;
};

create.prototype.header = function(headerKey, headerValue) {
  this.headers[headerKey] = headerValue;

  return this;
};

module.exports = create;
