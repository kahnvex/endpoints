Endpoints
=========

[![Build Status](https://travis-ci.org/kahnjw/endpoints.png)](https://travis-ci.org/kahnjw/endpoints)

Simple helper library for HTTP service clients. Endpoints works in the browser
and in Node, using [RequestAdapter](https://github.com/kahnjw/RequestAdapter/) to expose a common interface for Request Response objects.

## tl;dr

```javascript
var Endpoints = require('endpointsjs');

var myEndpoint = new Endpoints.create('/some/url/pattern')
  .header('Content-Type', 'application/json')
  .methods(['get', 'post']);

myEndpoint.get()
  .send()          // Returns an Q Promise (Promises/A+)
  .invoke('text')  // You may invoke any method a RequestAdapter implements
  .done(console.log);
```

## Install it

```
npm install endpointsjs
```

## Usage

Use Endpoints to create an endpoint pattern, then call methods on that pattern and get promises back. No pyramid of doom. Code over configuration.

```javascript
var Endpoints = require('endpointsjs');

var myEndpoint = new Endpoints.create('/some/url/pattern')
  .header('Content-Type', 'application/json')
  .methods(['get', 'post']);

var promise = myEndpoint.get()
  .send(); // Returns an Q Promise (Promises/A+)

// You can do something like this
promise
.then(function(requestAdapter) {
  return requestAdapter.text();
})
.done(function(text) {
  console.log(text);
});

// Which is equivalent to
promise
.invoke('text')
.done(console.log);
```

Sending data to the server is also easy

```javascript
var myOtherEndpoint = new Endpoints.create('/some/other/url/pattern')
  .methods(['options', 'post', 'delete']);

myOtherEndpoint.post()
  .data({myData: 123})
  .send()
  ...
  done();
```

It is also possible to build a URL by passing arguments

```javascript
var myOtherEndpoint = new Endpoints.create('/users/[userId]-[username]')
  .methods('get');

myOtherEndpoint.post()
  .param('userId', 123)
  .param('username', 'kahnjw')
  .send() // GETs the URL: /users/123-kahnjw
  ...
  .done();
```
