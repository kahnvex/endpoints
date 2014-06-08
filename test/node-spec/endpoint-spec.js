'use strict';

var Endpoints = require('../../src/index');
var chai = require('chai');
var mock = require('./mock-server');
var chaiAsPromised = require('chai-as-promised');


chai.should();
chai.use(chaiAsPromised);

describe('endpoints', function() {
  var promise;

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
