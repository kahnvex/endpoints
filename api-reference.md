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

## endpoint.methods(method | [methods])

Sets the HTTP methods (`GET`, `PUT`, `POST`, `DELETE` etc) that the `endpoint` can call. Returns the `endpoint`.

```javascript
endpoint.methods(['get', 'post']);
```

## endpoint.set(headerName, headerValue)

Set an HTTP request header. Returns the `endpoint`.

```javascript
endpoint.set('Content-Type', 'application/json');
```

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
  param2: 'val2
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
var getMethod = Endpoint.create('/users/[user_id]').get();
getMethod
.param('user_id', 1234)
.send(); // Sends a GET to /users/1234
```


## method.send()

Makes the request and returns a promise.

