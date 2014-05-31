var $ = require('jquery');
var qjax = require('qjax');

var httpMethods = {};

var methodHelper = function(method) {
  return function(options) {
    options = $.extend({}, this.ajaxOptions, options);

    return qjax.methodFactory(method)(options);
  };
};

httpMethods.head = methodHelper('HEAD');
httpMethods.options = methodHelper('OPTIONS');
httpMethods.get = methodHelper('GET');
httpMethods.post = methodHelper('POST');
httpMethods.put = methodHelper('PUT');
httpMethods.patch = methodHelper('PATCH');
httpMethods.delete = methodHelper('DELETE');

module.exports = httpMethods;
