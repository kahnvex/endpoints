# [Changelog](https://github.com/kahnjw/endpoints/releases)

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
