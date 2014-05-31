'use strict';

var GetPost = require('./get-post');
var GetPutDelete = require('./get-put-delete');
var GetPut = require('./get-put');
var Custom = require('./custom');

var Endpoints = {};

Endpoints.GetPost = GetPost;
Endpoints.GetPut = GetPut;
Endpoints.GetPutDelete = GetPutDelete;
Endpoints.Custom = Custom;

module.exports = Endpoints;
