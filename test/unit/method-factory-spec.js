var MethodFactory = require('../../src/method-factory');
var chai = require('chai');
var shmock = require('shmock');
var expect = chai.expect;


chai.should();

describe('method factory', function() {
  var method;
  var endpoint = {};

  beforeEach(function() {
    method = new MethodFactory('/', 'get', endpoint);
  });

  it('returns itself after calls to url', function() {
    method.url('/')
    .should.equal(method);
  });

  it('return itself after calls to header', function() {
    method.header('some', 'header')
    .should.equal(method);
  });

  describe('sending requests to the server', function() {
    var returned;
    var dataReturned = {data: 'is data-y'};
    var mock = shmock(9000);

    beforeEach(function(done) {
      var url = 'http://localhost:9000/'
      var handler = mock.get('/').reply(200, dataReturned);

      var capture = function(_data) {
        returned = _data;
        handler.done();
        done();
      };

      method
      .url(url)
      .send()
      .then(capture, capture);
    });

    it('returns the endpoint after request is completed', function() {
      expect(returned).to.equal(endpoint);
    });

    it('stores data after request is complete', function() {
      expect(returned.data).to.eql(dataReturned);
    });
  });
});
