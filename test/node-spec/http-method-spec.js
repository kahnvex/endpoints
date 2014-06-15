'use strict';

var Method = require('../../src/http-method');
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var mock = require('./mock-server');


chai.should();
chai.use(chaiAsPromised);

describe('method factory', function() {
  var method;
  var endpointConfig = {
    domain: 'http://localhost:9000',
    pattern: ''
  };

  beforeEach(function() {
    method = new Method('get', endpointConfig);
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

      promise = method
        .query({param: 'value'})
        .send();
    });

    it('returns a response after request is completed', function(done) {
      promise
      .get('res')
      .get('statusCode')
      .should.eventually.equal(200)
      .notify(done);
    });
  });
});
