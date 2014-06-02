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

      var responseHandler = function(_endpoint) {
        returnedEndpoint = _endpoint;
        done();
      };

      fakeEndpoint.get
        .send()
        .then(responseHandler, responseHandler);
    });

    it('places data in the data property of the pattern', function() {
      fakeEndpoint.data.should.have.property('data', 'so much data');
    });

    it('returns the endpoint when the promise is resolved', function() {
      returnedEndpoint.should.be.exactly(fakeEndpoint);
    });

    it('generates the correct objects', function() {
      fakeEndpoint.get.should.be.an.Object;
      fakeEndpoint.delete.should.be.an.Object;
      fakeEndpoint.patch.should.be.an.Object;
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

      fakeEndpoint.get
        .url('/base/test/data-2-fixture.json')
        .send()
        .then(complete, complete);
    });

    it('will override the endpoint url', function() {
      fakeEndpoint.data.should.have.property('GET', 'all the things');
    });
  });

  describe('unsafe operations', function() {
    var fakeEndpoint;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/fake/url')
        .methods(['post'])
        .data({endpoint: 'data'});

      var complete = function() {
        done();
      };

      fakeEndpoint.post
        .data({some: 'data'})
        .send()
        .then(complete, complete);
    });

    it('will use the methods data over the endopints data', function() {
      fakeEndpoint.data.should.have.property('some', 'data');
    });
  });

  describe('unsafe operations', function() {
    var fakeEndpoint;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/fake/url')
        .data({more: 'data'})
        .methods(['post', 'put']);

      var responseHandler = function() {
        done();
      };

      fakeEndpoint.post
        .send()
        .then(responseHandler, responseHandler);
    });

    it('stores data on the endpoint\s data property', function() {
      fakeEndpoint.data.should.have.property('more', 'data');
    });
  });

  describe('error behavior', function() {
    var error;
    var fakeEndpoint;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/404/url')
        .methods(['get']);

      var responseHandler = function(_error) {
        error = _error;
        done();
      };

      fakeEndpoint.get
        .send()
        .then(responseHandler, responseHandler);
    });

    it('returns an error with a status, when received form server', function() {
      error.status.should.be.exactly(404);
    });

    it('returns an error with responseText', function() {
      error.responseText.should.be.exactly('NOT FOUND');
    });
  });

  describe('sending multiple requests', function() {
    var error;
    var fakeEndpoint;
    var firstCalled = false;
    var seecondCalled = false;

    beforeEach(function(done) {
      fakeEndpoint = Endpoints.create('/404/url')
        .methods(['get']);

      var firstResponse = function() {
        firstCalled = true;
      };
      var secondResponse = function() {
        seecondCalled = true;
        done();
      };

      fakeEndpoint.get.send()
        .then(firstResponse, firstResponse);

      fakeEndpoint.get.send()
        .then(secondResponse, secondResponse);
    });

    it('calls both functions after send', function() {
      firstCalled.should.be.exactly(true);
      seecondCalled.should.be.exactly(true);
    });
  });
});
