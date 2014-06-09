'use strict';

var newHttpConfigurable = function() {
  var httpConfigurable = {};

  httpConfigurable.thenApplies = [];

  httpConfigurable.headers = {};

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

  return httpConfigurable;
};


module.exports = newHttpConfigurable;
