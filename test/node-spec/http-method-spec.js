'use strict';

var Method = require('../../src/http-method');
var chai = require('chai');
var mock = require('./mock-server');
var expect = chai.expect;



chai.should();

describe('method factory', function() {
  var method;
  var endpoint = {
    getDomain: function() {
      return 'http://localhost:9000';
    },
    getPattern: function() {
      return '';
    }
  };

  beforeEach(function() {
    method = new Method('get', endpoint);
  });

  it('returns itself after calls to param', function() {
    method.param('key', 'value')
    .should.equal(method);
  });

  it('returns itself after calls to header', function() {
    method.header('some', 'header')
    .should.equal(method);
  });

  describe('sending requests to the server', function() {
    var response;

    beforeEach(function(done) {
      var capture = function(_data) {
        response = _data;
        done();
      };

      mock.get('/').reply(200, {});

      method
      .send()
      .then(capture, capture);
    });

    it('returns a response after request is completed', function() {
      expect(response).to.have.property('req');
      expect(response).to.have.property('res');
      response.res.statusCode.should.equal(200);
    });
  });
});
