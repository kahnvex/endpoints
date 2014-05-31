'use strict';

var httpMethods = require('./http-methods');


function GetPut(options) {
  this.ajaxOptions = options;

  this.options = httpMethods.options.bind(this);
  this.get = httpMethods.get.bind(this);
  this.put = httpMethods.put.bind(this);
}


module.exports = GetPut;
