Endpoints
=========

[![Build Status](https://travis-ci.org/kahnjw/endpoints.png)](https://travis-ci.org/kahnjw/endpoints)

Simple helper library for your REST service clients.

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


var promiseCallback = function(response) {
  console.log(response);
};

myEndpoint.get()
  .send()
  .then(promiseCallback);
```

Sending data to the server is also easy

```javascript
var myOtherEndpoint = new Endpoints.create('/some/other/url/pattern')
  .methods(['options', 'post', 'delete']);

myOtherEndpoint.post()
  .data({myData: 123})
  .send();
```

It is also possible to build a URL by passing arguments

```javascript
var myOtherEndpoint = new Endpoints.create('/users/[userId]-[username]')
  .methods(['get']);

myOtherEndpoint.post()
  .data({myData: 123})
  .param('userId', 123)
  .param('username', 'kahnjw')
  .send(); // GETs the URL: /users/123-kahnjw
```
