'use strict';

var Endpoints = require('../../src/index');
var chai = require('chai');
var mock = require('./mock-server');


chai.should();

describe('method factory', function() {
  var endpoint;
  var response;

  describe('bare bones behavior', function() {
    beforeEach(function(done) {
      var capture = function(_response) {
        response = _response;
        done();
      };

      endpoint = Endpoints.create()
        .methods(['get'])
        .domain('http://localhost:9000');

      mock.get('/').reply(200);

      endpoint.get()
      .param('someId', 123)
      .send()
      .then(capture, capture);
    });

    it('can make requests to the web root', function() {
      response.res.statusCode.should.equal(200);
    });
  });

  describe('parameter insertion', function() {
    beforeEach(function(done) {
      var capture = function(_response) {
        response = _response;
        done();
      };

      endpoint = Endpoints.create('/endpoint/[someId]-[otherId]/[someName]')
        .methods(['get'])
        .domain('http://localhost:9000');

      mock.get('/endpoint/123-string-id/chaz').reply(200);

      endpoint.get()
      .param('someId', 123)
      .param('someName', 'chaz')
      .param('otherId', 'string-id')
      .send()
      .then(capture, capture);
    });

    it('can insert parameters to the url', function() {
      response.res.statusCode.should.equal(200);
    });
  });
});
