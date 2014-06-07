'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
require('./bind-polyfill');

chai.should();
chai.use(chaiAsPromised);

var Endpoints = require('../../src/index');


describe('endpoints', function() {
  it('is an object', function() {
    Endpoints.should.be.a.Object;
  });

  describe('using an endpoint pattern', function() {
    var fakeEndpoint;

    beforeEach(function() {
      fakeEndpoint = Endpoints.create('/base/test/data-1-fixture.json')
        .methods(['get', 'patch', 'delete']);
    });

    it('returns a response object', function(done) {
      fakeEndpoint.get()
        .send()
        .invoke('status')
        .should.eventually.equal(200)
        .notify(done);
    });

    it('generates the correct objects', function() {
      fakeEndpoint.get.should.be.a.Function;
      fakeEndpoint.delete.should.be.a.Function;
      fakeEndpoint.patch.should.be.a.Function;
    });
  });

  describe('error behavior', function() {
    var fakeEndpoint;
    var promise;

    beforeEach(function() {
      fakeEndpoint = Endpoints.create('/404/url')
        .methods('get');

      promise = fakeEndpoint.get()
        .send();
    });

    it('returns an error with a status, when received form server', function(done) {
      promise
      .invoke('status')
      .should.eventually.equal(404)
      .notify(done);
    });

    it('returns an error with responseText', function(done) {
      promise
      .invoke('text')
      .should.eventually.equal('NOT FOUND')
      .notify(done);
    });
  });
});
