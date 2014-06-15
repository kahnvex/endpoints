'use strict';

var Endpoints = require('../../src/index');
var chai = require('chai');
var mock = require('./mock-server');
var chaiAsPromised = require('chai-as-promised');


chai.should();
chai.use(chaiAsPromised);

describe('endpoints', function() {
  var promise;

  describe('interface layout', function() {
    var endpoint = Endpoints.create();

    it('endpoint.header returns the endpoint', function() {
      endpoint.header('key', 'val')
      .should.equal(endpoint);
    });

    it('endpoint.domain returns the endpoint', function() {
      endpoint.domain('domain')
      .should.equal(endpoint);
    });

    it('endpoint.contentType returns the endpoint', function() {
      endpoint.contentType('json')
      .should.equal(endpoint);
    });

    it('endpoint.accepts returns the endpoint', function() {
      endpoint.accepts('xml')
      .should.equal(endpoint);
    });

    it('endpoint.pattern returns the endpoint', function() {
      endpoint.pattern('/url')
      .should.equal(endpoint);
    });

    it('endpoint.methods returns the endpoint', function() {
      endpoint.methods('get')
      .should.equal(endpoint);
    });
  });

  describe('bare bones behavior', function() {
    beforeEach(function() {
      var endpoint = Endpoints.create()
        .methods(['get'])
        .domain('http://localhost:9000');

      mock.get('/').reply(200);
      promise = endpoint.get()
        .param('someId', 123)
        .query({'param': 'value'})
        .send();
    });

    it('can make requests to the web root', function(done) {
      promise
      .invoke('status')
      .should.eventually.equal(200)
      .notify(done);
    });

    it('attaches query parameters to the url', function(done) {
      promise
      .invoke('url')
      .should.eventually.equal('/?param=value')
      .notify(done);
    });
  });

  describe('promise permutation on the endpoint object', function() {
    beforeEach(function() {
      var permutation = function(requestAdapter) {
        return requestAdapter.text() + ' now you know';
      };

      var endpoint = Endpoints.create()
        .methods('get')
        .thenApply(permutation)
        .domain('http://localhost:9000');

      mock.get('/').reply(200, 'If you didn\'t know');
      promise = endpoint.get()
        .send();
    });

    it('permutes the promise with a specified permutation', function(done) {
      promise
      .should.eventually.equal('If you didn\'t know now you know')
      .notify(done);
    });
  });

  describe('promise permutation on the method object', function() {
    beforeEach(function() {
      var permutation = function(requestAdapter) {
        return requestAdapter.text() + ' now you know';
      };

      var endpoint = Endpoints.create()
        .methods('get')
        .domain('http://localhost:9000');

      endpoint.get.thenApply(permutation);

      mock.get('/').reply(200, 'If you didn\'t know');
      promise = endpoint.get()
        .send();
    });

    it('permutes the promise with a specified method permutation', function(done) {
      promise
      .should.eventually.equal('If you didn\'t know now you know')
      .notify(done);
    });
  });

  describe('promise permutation ordering', function() {
    beforeEach(function() {
      var endpoint = Endpoints.create()
        .methods('get')
        .thenApply(function(requestAdapter) {
          var num = Number(requestAdapter.text());
          return num * 2;
        })
        .domain('http://localhost:9000');

      endpoint.get.thenApply(function(num) {
        return num + 5;
      });

      mock.get('/').reply(200, '3');
      promise = endpoint.get()
        .send();
    });

    it('orders permutation from least specific to most', function(done) {
      promise
      .should.eventually.equal(11)
      .notify(done);
    });
  });

  describe('promise rejection', function() {
    beforeEach(function() {
      var endpoint = Endpoints.create()
        .methods('get')
        .domain('/');

      promise = endpoint.get()
        .send();
    });

    it('rejects promises on errors', function(done) {
      promise
      .should.eventually.be.rejectedWith('connect ECONNREFUSED')
      .notify(done);
    });
  });

  describe('parameter insertion', function() {
    var promise;

    beforeEach(function() {
      var endpoint = Endpoints.create('/endpoint/[someId]-[otherId]/[someName]')
        .methods('get')
        .domain('http://localhost:9000');

      mock.get('/endpoint/123-string-id/chaz').reply(200);
      promise = endpoint.get()
        .param('someId', 123)
        .param('someName', 'chaz')
        .param('otherId', 'string-id')
        .send();
    });

    it('can insert parameters to the url', function(done) {
      promise
      .invoke('status')
      .should.eventually.equal(200)
      .notify(done);
    });
  });
});
