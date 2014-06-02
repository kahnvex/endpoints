var Q = require('q');

var genDeferred = function(methodObj) {
  var deferred = Q.defer();

  var reject = function(a, b, c) {
    deferred.reject(a, b, c);
  };

  var resolve = function(a, b, c) {
    deferred.resolve(a, b, c);
  };

  return {
    promise: deferred.promise,
    reject: reject,
    resolve: resolve,
    _deferred: deferred
  };
};

module.exports = genDeferred;
