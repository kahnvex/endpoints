'use strict';

var Method = require('../../src/http-method');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var mock = require('./mock-server');


chai.should();
chai.use(chaiAsPromised);

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
    var promise;

    beforeEach(function() {
      mock.get('/').reply(200, {});

      promise = method.send();
    });

    it('returns a response after request is completed', function(done) {
      promise
      .invoke('status')
      .should.eventually.equal(200)
      .notify(done);
    });
  });
});
