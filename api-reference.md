# Endpoints API Reference

## Endpoints Interface

### Endpoints.create(pattern)

Returns an `endpoint` object, optionally takes a url pattern as a string.

```javascript
var endpoint = Endpoints.create('/users/[user_id]');
```

## Endpoint Instance Interface

### endpoint.pattern(pattern)

Set the pattern that the endpoint should use when making requests. Returns the `endpoint`.

```javascript
endpoint.pattern('/users/[user_id]');
```

### endpoint.domain(domain)

Set the domain of the endpoint. Return the `endpoint`.

```javascript
endpoint.domain('http://google.com');
```

### endpoint.methods(method | [methods])

Sets the HTTP methods (`GET`, `PUT`, `POST`, `DELETE` etc) that the `endpoint` can call. Takes an array of method strings, or a single method as a string. Returns the `endpoint`.

```javascript
endpoint.methods(['get', 'post']);
```

### endpoint.header(headerName, headerValue)

Set an HTTP request header. Returns the `endpoint`.

```javascript
endpoint.header('Content-Type', 'application/json');
```

### endpoint.contentType(mimeType)

Sugar method for `endpoint.header('Content-Type', mimeType)`

### endpoint.accepts(mimeType)

Sugar method for `endpoint.header('Accepts', mimeType)`

### endpoint.thenApply(onFullfilled, onError, onProgress)

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

This allows permutations specific to an HTTP method. `thenApplies` are ordered
from least specific to most specific. In other words, permutations specified
on the endpoint will be applied _before_ permutations specified on a method of
that endpoint.

## HTTP Method Interface

### endpoint.method.thenApply(onFullfilled, onError, onProgress)

Where method is one of `get`, `put`, `post`, `delete`, etc.

Same as `endpoint.thenApply()` but specific to that method.

Returns the `method` object.

### endpoint.method.header(onFullfilled, onError, onProgress)

Where method is one of `get`, `put`, `post`, `delete`, etc.

Same as `endpoint.header()` but specific to that method.

Returns the `method` object.

### endpoint.get()

Returns a get `method` instance. The `method` must be specified by `endpoint.methods(method | [methods])`.

```javascript
var getMethod = endpoint.get();
```

### endpoint.put()

Returns a put `method` instance. The `method` must be specified by `endpoint.methods(method | [methods])`.

```javascript
var putMethod = endpoint.put();
```

### endpoint.patch()

Returns a patch `method` instance. The `method` must be specified by `endpoint.methods(method | [methods])`.

```javascript
var patchMethod = endpoint.patch();
```

### endpoint.post()

Returns a post `method` instance. The `method` must be specified by `endpoint.methods(method | [methods])`.

```javascript
var postMethod = endpoint.post();
```

### endpoint.delete()

Returns a delete `method` instance. The `method` must be specified by `endpoint.methods(method | [methods])`.

```javascript
var deleteMethod = endpoint.delete();
```

### endpoint.options()

Returns a options `method` instance. The `method` must be specified by `endpoint.methods(method | [methods])`.

```javascript
var optionsMethod = endpoint.options();
```

### endpoint.head()

Returns a head `method` instance. The `method` must be specified by `endpoint.methods(method | [methods])`.

```javascript
var headMethod = endpoint.head();
```

### endpoint.trace()

Returns a trace `method`. The `method` must be specified by `endpoint.methods(method | [methods])`.

```javascript
var traceMethod = endpoint.trace();
```

## Method Instance Interface

### method.query({queryParameters})

Takes an object of query parameters. Keys are query parameter names, values are query parameter values. Returns the `method`.

```javascript
method.query({
  param1: 'val1',
  param2: 'val2'
});
```

### method.data(value)

Takes a value that should be sent to the server on `POST`, `PUT` or `PATCH` operations. Returns the `method`.

```javascript
method.data({
  username: 'kahnjw',
  location: 'San Francisco'
});
```

### method.param(paramName, paramValue)

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

### method.header(headerName, headerValue)

Set an HTTP request header. Returns the `method`.

```javascript
method.header('Content-Type', 'application/json');
```

### method.contentType(mimeType)

Sugar method for `method.header('Content-Type', mimeType)`.

### method.accepts(mimeType)

Sugar method for `method.header('Accepts', mimeType)`

### method.thenApply(onFullfilled, onError, onProgress)

Add a function to permute the request promise. This will apply `promise.then(onFullfilled, onError, onProgress)` to the request promise before it is returned to you. Read up on [Promises/A+](http://promises-aplus.github.io/promises-spec/), [Q's Promise implementation](https://github.com/kriskowal/q), and [Q's API Reference](https://github.com/kriskowal/q/wiki/API-Reference).

```javascript
method.thenApply(onFullfilled, onError, onProgres);
```

### method.send()

Makes the request and returns a [Q Promise](https://github.com/kriskowal/q).

## Putting it all Together

#### Creating a Simple Endpoint

Let's assume there is an endpoint at `/api/users` that takes two methods: `get`
and `post`. It will serialize to multiple data formats and expects the
client to specify the data format that is accepts. It can also take multiple
data formats on `post` and expects the client to specify the data format
(Content-Type).

```javascript
var usersEndpoint = Endpoints.create('/api/users');
  .methods(['get', 'post'])
  .accepts('application/json')
  .contentType('application/json');
```

### Take it a step further

Let's assume performing a `get` or a `post` on `/api/users` returns a JSON list
of user objects. And we want our endpoint to just return that list.

```javascript
var getUserList = function(requestAdapter) {
  return requestAdapter.responseObject();
};

usersEndpoint.thenApply(getUserList);
```

Or if the endpoint only responds with the user list on `get` requests we can
apply the permutation to the get object.

```javascript
var getUserList = function(requestAdapter) {
  return requestAdapter.responseObject();
};

usersEndpoint.get.thenApply(getUserList);
```

### Make a Request

Now when when a request is made, a promise is returned, which when resolved
"returns" the list of users.

```javascript
var getUsers = usersEndpoint.get();

getUsers
.send()              // Returns a promise
.done(console.log);  // Prints the list of users
```

Or, you can style it like this:

```javascript
usersEndpoint
.get()
.send()              // Returns a promise
.done(console.log);  // Prints the list of users
```
----

### Creating a More Complex Endpoint

Let's assume that there is an endpoint at `/api/users/[user-id]` that takes
three methods: `get`, `put` and `delete`. This endpoint returns
the user object that is being updated (`put`), read (`get`), or deleted
(`delete`) on success. We'd also like to ensure that the request completed
successfully or raise an error.

```javascript
function HttpError(message) {
   this.message = message;
   this.name = "HttpError";
}

var twoHundredsOrThrow = function(requestAdapter) {
  if(requestAdapter.status() > 299 || requestAdapter.status() < 200) {
    throw new HttpError('Bad things');
  }
  return requestAdapter;
};

var getUserObject = function(requestAdapter) {
  return requestAdapter.responseObject();
};

var userEndpoint = Endpoints.create('api/users/[user-id]')
  .methods(['get', 'put', 'delete'])
  .accets('application/json')
  .contentType('application/json')
  .thenApply(twoHundredsOrThrow)
  .thenApply(getUserObject);
```

### Using a Complex Endpoint

Let's now think of an imaginary use case. Say we need to delete a user
if they're expired attributes is `true`. The user object also has a
property username.

```javascript
var userId = 1234;
var deleteUser = function(expired) {
  if(expired) {
    userEndpoint
    .delete()
    .param('user-id', userId)
    .send()
    .get('username')
    .done(function(username) {
      console.log(username + ' successfully deleted.');
    });
  }
};

userEndpoint
.get()
.param('user-id', userId)
.send()
.get('expired')
.then(deleteUser);
```
