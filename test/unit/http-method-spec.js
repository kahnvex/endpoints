'use strict';

var Method = require('../../src/http-method');
var chai = require('chai');
var shmock = require('shmock');
var expect = chai.expect;


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

  it('return itself after calls to header', function() {
    method.header('some', 'header')
    .should.equal(method);
  });

  describe('sending requests to the server', function() {
    var returned;
    var data = {data: 'is data-y'};
    var mock = shmock(9000);

    beforeEach(function(done) {
      var url = 'http://localhost:9000/';
      var capture = function(_data) {
        returned = _data;
        done();
      };

      mock.get('/').reply(200, data);

      method
      .url(url)
      .send()
      .then(capture, capture);
    });

    it('returns the endpoint after request is completed', function() {
      expect(returned).to.equal(endpoint);
    });

    it('stores data after request is complete', function() {
      expect(returned.data).to.eql(data);
    });
  });
});
