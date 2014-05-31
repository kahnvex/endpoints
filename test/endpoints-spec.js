'use strict';

require('should');
require('./bind-polyfill');

var Endpoints = require('../src/index');


describe('endpoints', function() {
  it('is an object', function() {
    Endpoints.should.be.a.Object;
  });

  it('has GetPost, GetPutDelete endpoint patterns', function() {
    Endpoints.should.have.property('GetPost');
    Endpoints.should.have.property('GetPutDelete');
  });

  describe('using an endpoint pattern', function() {
    var response;

    beforeEach(function(done) {
      var fakeEndpoint = new Endpoints.GetPost({
        url: '/base/test/data-1-fixture.json'
      });

      var checkResponse = function(_response) {
        response = _response;
        done();
      };

      var fail = function(_response) {
        response = _response;
        done();
      };

      fakeEndpoint.get()
      .then(checkResponse, fail);
    });

    it('promise resolves when the response is received', function() {
      response.should.have.property('data', 'so much data');
    });
  });

  describe('create a custom endpoint pattern', function() {
    var customEndpoint;

    beforeEach(function() {
      customEndpoint = new Endpoints.Custom({
        url: '/',
        methodList: ['get', 'patch', 'delete']
      });
    });

    it('generates the correct methods', function() {
      customEndpoint.get.should.be.a.Function;
      customEndpoint.delete.should.be.a.Function;
      customEndpoint.patch.should.be.a.Function;
    });
  });

  describe('override endpoint settings', function() {
    var response;

    beforeEach(function(done) {
      var fakeEndpoint = new Endpoints.GetPost({
        url: '/base/test/data-1-fixture.json'
      });

      var checkResponse = function(_response) {
        response = _response;
        done();
      };

      var fail = function(_response) {
        response = _response;
        done();
      };

      fakeEndpoint.get({url: '/base/test/data-2-fixture.json'})
      .then(checkResponse, fail);
    });

    it('will override endpoint settings', function() {
      response.should.have.property('GET', 'all the things');
    });
  });
});
