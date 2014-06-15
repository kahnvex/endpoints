'use strict';

var _ = require('lodash');


var httpConfigurable = {};

httpConfigurable.initHttpConfigurable = function() {
  this.thenApplies = [];
  this.headers = [];
};

httpConfigurable.header = function(headerKey, headerValue) {
  this.headers[headerKey] = headerValue;

  return this;
};

httpConfigurable.contentType = function(mimeType) {
  return this.header('Content-Type', mimeType);
};

httpConfigurable.accepts = function(mimeType) {
  return this.header('Accepts', mimeType);
};

httpConfigurable.thenApply = function(onFulfilled, onRejected, onProgress) {
  var applies = {
    onFulfilled: onFulfilled,
    onRejected: onRejected,
    onProgress: onProgress
  };
  this.thenApplies.push(applies);

  return this;
};

httpConfigurable.mergeThenApplies = function(_thenApplies) {
  _.extend(this.thenApplies, _thenApplies);
};


module.exports = httpConfigurable;
