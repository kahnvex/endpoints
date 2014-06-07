Endpoints
=========

[![Build Status](https://travis-ci.org/kahnjw/endpoints.png)](https://travis-ci.org/kahnjw/endpoints)

Simple helper library for HTTP service clients. Endpoints works in the browser
and in Node.

## tl;dr

```javascript
var Endpoints = require('endpointsjs');

var myEndpoint = new Endpoints.create('/some/url/pattern')
  .header('Content-Type', 'application/json')
  .methods(['get', 'post']);

myEndpoint.get()
  .send() // Returns an Q Promise (Promises/A+)
  .get('xhr')
  .get('responseText')
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

// In Node you can do something like this
promise
.get('res')
.get('responseText')
.then(function(text) {
  console.log(text);
  return text;
})
.done(function(data) {
  // Do stuff with the data
});

// Or, for brevity, you can do
promise
.get('res')
.get('responseText')
.done(console.log);

// In the browser response objects are a little different
promise
.get('xhr')
.get('text')
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

var myOtherEndpoint = new Endpoints.create('/some/other/url')
  .methods(['options', 'post', 'delete']);

myOtherEndpoint.post()
  .data({myData: 123})
  .send();
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
