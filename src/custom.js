'use strict';

var httpMethods = require('./http-methods');


function Custom(options) {
  var index;
  var methodList = options.methodList;

  for(index in methodList) {
    this[methodList[index]] = httpMethods[methodList[index]].bind(this);
  }

  this.ajaxOptions = options;
}


module.exports = Custom;
