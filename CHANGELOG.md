# [Changelog](https://github.com/kahnjw/endpoints/releases)

## 0.3.4

* Change endpoint.thenApply to endpoint.then
* Keep alias endpoint.thenApply

## 0.3.3

* Update API reference to npm

## 0.3.2

* Allow headers to be set from method object

## 0.3.1

* Add sugar method Endpoint.contentType
* Add sugar method Endpoint.accepts
* Add sugar method Method.contentType
* Add sugar method Method.accepts

## 0.3.0

* Add support for query parameter configuration
* Wrap request/response objects in [RequestAdapters](https://github.com/kahnjw/RequestAdapter/)
* Add `thenApply` method for adding promise permutations to the Endpoint and
method interfaces
* Add a watch task for ease of development
* Add API Reference

## 0.2.0

* Configure Endpoint's via an endpoint interface instead of using a lange
options hash.
* Allow URL patterns to contain tokens
* Allow user to specify any HTTP method they want
* Don't hold endpoint state
