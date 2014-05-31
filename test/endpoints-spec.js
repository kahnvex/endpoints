'use strict';

require('should');
require('./bind-polyfill');

var Endpoints = require('../src/index');


describe('endpoints', function() {
  it('is an object', function() {
    Endpoints.should.be.a.Object;
  });

  describe('using an endpoint pattern', function() {
    var response;
    var fakeEndpoint;
    var returnedEndpoint;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/base/test/data-1-fixture.json')
        .methods(['get', 'patch', 'delete']);

      var checkResponse = function(_endpoint) {
        returnedEndpoint = _endpoint;
        done();
      };

      var fail = function(_response) {
        true.should.be.false;
        done();
      };

      fakeEndpoint.get()
        .send()
        .then(checkResponse, fail);
    });

    it('places data in the data property of the pattern', function() {
      fakeEndpoint.data.should.have.property('data', 'so much data');
    });

    it('returns the endpoint when the promise is resolved', function() {
      returnedEndpoint.should.be.exactly(fakeEndpoint);
    });
  });

  describe('create a custom endpoint pattern', function() {
    var customEndpoint;

    beforeEach(function() {
      customEndpoint = Endpoints.create('/')
        .methods(['get', 'patch', 'delete'])
        .header('Content-Type', 'application/json');
    });

    it('generates the correct methods', function() {
      customEndpoint.get.should.be.a.Function;
      customEndpoint.delete.should.be.a.Function;
      customEndpoint.patch.should.be.a.Function;
    });
  });

  describe('override endpoint settings', function() {
    var response;
    var fakeEndpoint;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/base/test/data-1-fixture.json')
        .methods(['get']);

      var complete = function(_endpoint) {
        done();
      };

      fakeEndpoint.get('/base/test/data-2-fixture.json')
        .send()
        .then(complete, complete);
    });

    it('will override endpoint settings', function() {
      fakeEndpoint.data.should.have.property('GET', 'all the things');
    });
  });

  describe('posting and putting data', function() {
    var fakeEndpoint;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/fake/url')
        .methods(['post', 'put']);

      var complete = function() {
        done();
      };

      fakeEndpoint.post()
        .data({some: 'data'})
        .send()
        .then(complete, complete);
    });

    it('will override endpoint settings', function() {
      fakeEndpoint.data.should.have.property('some', 'data');
    });
  });

  describe('posting and putting data', function() {
    var fakeEndpoint;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/fake/url')
        .data({more: 'data'})
        .methods(['post', 'put']);

      var complete = function() {
        done();
      };

      fakeEndpoint.post()
        .send()
        .then(complete, complete);
    });

    it('will override endpoint settings', function() {
      fakeEndpoint.data.should.have.property('more', 'data');
    });
  });

  describe('error behavior', function() {
    var error;
    var fakeEndpoint;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/404/url')
        .methods(['get']);

      var success = function() {
        true.should.be.false;
        done();
      };

      var fail = function(_error) {
        error = _error;
        done();
      };

      fakeEndpoint.get()
        .send()
        .then(success, fail);
    });

    it('returns an error correctly', function() {
      error.status.should.be.exactly(404);
    });
  });
});
