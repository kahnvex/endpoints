'use strict';

var Method = require('../../src/http-method');
var chai = require('chai');
var shmock = require('shmock');
var expect = chai.expect;
var mock = shmock(9000);


chai.should();

describe('method factory', function() {
  var method;
  var endpoint = {};

  beforeEach(function() {
    method = new Method('/', 'get', endpoint);
  });

  it('returns itself after calls to url', function() {
    method.url('/')
    .should.equal(method);
  });

  it('returns itself after calls to header', function() {
    method.header('some', 'header')
    .should.equal(method);
  });

  describe('sending requests to the server', function() {
    var response;

    beforeEach(function(done) {
      var url = 'http://localhost:9000/';
      var capture = function(_data) {
        response = _data;
        done();
      };

      mock.get('/').reply(200, {});

      method
      .url(url)
      .send()
      .then(capture, capture);
    });

    it('returns a response after request is completed', function() {
      expect(response).to.have.property('req');
      expect(response).to.have.property('res');
      response.res.statusCode.should.equal(200);
    });
  });

  describe('statelessness', function(done) {
    var urlFirst = 'http://localhost:9000/first';
    var urlSecond = 'http://localhost:9000/second';

    beforeEach(function(done) {
      var capture = function() {
        done();
      };

      mock.get('/first').reply(200, {});

      method
      .url(urlFirst)
      .send()
      .then(capture);
    });

    it('does second request', function(done) {
      var assertSuccess = function(response) {
        response.res.statusCode.should.equal(204);
        done();
      };

      mock.get('/second').reply(204);

      method
      .url(urlSecond)
      .send()
      .then(assertSuccess);
    });
  });
});
