'use strict';

var httpMethods = require('./http-methods');


function GetPutDelete(options) {
  this.options = options;

  this.get = httpMethods.get.bind(this);
  this.put = httpMethods.put.bind(this);
  this.delete = httpMethods.delete.bind(this);
}


module.exports = GetPutDelete;
