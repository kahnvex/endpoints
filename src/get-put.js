'use strict';

var httpMethods = require('./http-methods');


function GetPut(options) {
  this.options = options;

  this.get = httpMethods.get.bind(this);
  this.put = httpMethods.put.bind(this);
}


module.exports = GetPut;
