'use strict';

var Endpoints = require('../../src/index');
var chai = require('chai');
var expect = chai.expect;
var mock = require('./mock-server');


chai.should();

describe('method factory', function() {
  var endpoint;
  var response;

  beforeEach(function(done) {
    var capture = function(_response) {
      response = _response;
      done();
    }
    endpoint = Endpoints.create('/endpoint/[someId]/[someName]')
      .methods(['get'])
      .domain('http://localhost:9000');

    mock.get('/endpoint/123/chaz').reply(200);

    endpoint.get()
    .param('someId', 123)
    .param('someName', 'chaz')
    .send()
    .then(capture, capture)
  });

  it('can insert parameters to the url', function() {
    response.res.statusCode.should.equal(200);
  });
});
