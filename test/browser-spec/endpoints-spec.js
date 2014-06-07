'use strict';

require('should');
require('./bind-polyfill');

var Endpoints = require('../../src/index');


describe('endpoints', function() {
  it('is an object', function() {
    Endpoints.should.be.a.Object;
  });

  describe('using an endpoint pattern', function() {
    var fakeEndpoint;
    var response;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/base/test/data-1-fixture.json')
        .methods(['get', 'patch', 'delete']);

      var responseHandler = function(_response) {
        response = _response;
        done();
      };

      fakeEndpoint.get()
        .send()
        .then(responseHandler, responseHandler);
    });

    it('returns a response object', function() {
      response.should.have.property('req');
      response.should.have.property('xhr');
    });

    it('generates the correct objects', function() {
      fakeEndpoint.get.should.be.a.Function;
      fakeEndpoint.delete.should.be.a.Function;
      fakeEndpoint.patch.should.be.a.Function;
    });
  });

  describe('error behavior', function() {
    var response;
    var fakeEndpoint;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/404/url')
        .methods('get');

      var responseHandler = function(_response) {
        response = _response;
        done();
      };

      fakeEndpoint.get()
        .send()
        .then(responseHandler);
    });

    it('returns an error with a status, when received form server', function() {
      response.xhr.status.should.be.exactly(404);
    });

    it('returns an error with responseText', function() {
      response.xhr.responseText.should.be.exactly('NOT FOUND');
    });
  });
});
