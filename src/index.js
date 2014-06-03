'use strict';

var Create = require('./create');

var Endpoints = {};

Endpoints.create = function(url) {
  return new Create(url);
};

module.exports = Endpoints;
