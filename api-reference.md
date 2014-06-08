# Endpoints API Reference

## Endpoints.create(pattern)

Returns an `endpoint` object, optionally takes a url pattern as a string.

```javascript
var endpoint = Endpoints.create('/users/[user_id]');
```

## endpoint.pattern(pattern)

Set the pattern that the endpoint should use when making requests. Returns the `endpoint`.

```javascript
endpoint.pattern('/users/[user_id]');
```

## endpoint.domain(domain)

Set the domain of the endpoint. Return the `endpoint`.

```javascript
endpoint.domain('http://google.com');
```

## endpoint.methods(method | [methods])

Sets the HTTP methods (`GET`, `PUT`, `POST`, `DELETE` etc) that the `endpoint` can call. Takes an array of method strings, or a single method as a string. Returns the `endpoint`.

```javascript
endpoint.methods(['get', 'post']);
```

## endpoint.set(headerName, headerValue)

Set an HTTP request header. Returns the `endpoint`.

```javascript
endpoint.set('Content-Type', 'application/json');
```

## endpoint.thenApply(onFullfilled, onError, onProgress)

Adds a function to permute all request promises. This will be applied to every
request promise ahead of time by calling
`promise.then(onFullfilled, onError, onProgress)`. The endpoint will aggregate
all permutations passed to `thenApply` and apply them in succession. Read up on
[Promises/A+](http://promises-aplus.github.io/promises-spec/),
[Q's Promise implementation](https://github.com/kriskowal/q), and
[Q's API Reference](https://github.com/kriskowal/q/wiki/API-Reference).
Returns the endpoint.

```javascript
endpoint.thenApply(onFullfilled, onError, onProgres);
```

This is useful if you know that you always want to permute a request promise in a
certain way. If you are only interested in the body of the response, you might
use `thenApply` to permute the promise to only give you the body, like this:

```javascript
var getBody = function(requestAdapter) {
  return requestAdapter.responseObject();
};
var passError = function(error) {
  throw error;
};
endpoint.thenApply(getBody, passError);

// Now the endpoint can be used in a way that assumes the response object
// is always passed to the onFullfilled function.
endpoint
.get()
.send()
.done(console.log);
```

`thenApply` may also be called on a method, like this:

```
endpoint.post.thenApply(onFullfilled, onError, onProgres);
```

This allows for permutations specific to an HTTP method that the endpoint implements. `thenApplies` are ordered from least specific to most specific. More specifically, permutations specified on the endpoint will be applied _before_ permutations specified on a method of that endpoint.

## endpoint.get()

Returns a get `method`. The `method` must be specified by `endpoint.methods(method | [methods])`.

## endpoint.put()

Returns a put `method`. The `method` must be specified by `endpoint.methods(method | [methods])`.

## endpoint.post()

Returns a post `method`. The `method` must be specified by `endpoint.methods(method | [methods])`.

## endpoint.delete()

Returns a delete `method`. The `method` must be specified by `endpoint.methods(method | [methods])`.

## endpoint.options()

Returns a options `method`. The `method` must be specified by `endpoint.methods(method | [methods])`.

## endpoint.head()

Returns a head `method`. The `method` must be specified by `endpoint.methods(method | [methods])`.

## endpoint.trace()

Returns a trace `method`. The `method` must be specified by `endpoint.methods(method | [methods])`.

## method.query({queryParameters})

Takes an object of query parameters. Keys are query parameter names, values are query parameter values. Returns the `method`.

```javascript
method.query({
  param1: 'val1',
  param2: 'val2'
});
```

## method.data(value)

Takes a value that should be sent to the server on `POST`, `PUT` or `PATCH` operations. Returns the `method`.

```javascript
method.data({
  username: 'kahnjw',
  location: 'San Francisco'
});
```

## method.param(paramName, paramValue)

Set a URL token.

```javascript
var endpoint = Endpoint.create('/users/[user_id]').methods('get');

endpoint
.get()
.param('user_id', 1234)
.send() // Sends a GET to /users/1234
...
.done();
```

## method.thenApply(onFullfilled, onError, onProgress)

Add a function to permute the request promise. This will apply `promise.then(onFullfilled, onError, onProgress)` to the request promise before it is returned to you. Read up on [Promises/A+](http://promises-aplus.github.io/promises-spec/), [Q's Promise implementation](https://github.com/kriskowal/q), and [Q's API Reference](https://github.com/kriskowal/q/wiki/API-Reference).

```javascript
method.thenApply(onFullfilled, onError, onProgres);
```

## method.send()

Makes the request and returns a [Q Promise](https://github.com/kriskowal/q).
