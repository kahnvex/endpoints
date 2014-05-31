'use strict';

var httpMethods = require('./http-methods');


function GetPost(options) {
  this.options = options;

  this.get = httpMethods.get.bind(this);
  this.post = httpMethods.post.bind(this);
}


module.exports = GetPost;
