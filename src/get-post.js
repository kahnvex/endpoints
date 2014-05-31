'use strict';

var httpMethods = require('./http-methods');


function GetPost(options) {
  this.ajaxOptions = options;

  this.options = httpMethods.options.bind(this);
  this.get = httpMethods.get.bind(this);
  this.post = httpMethods.post.bind(this);
}


module.exports = GetPost;
