Endpoints
=========

[![Build Status](https://travis-ci.org/kahnjw/endpoints.png)](https://travis-ci.org/kahnjw/endpoints)

Simple helper library for your REST service clients.

## Install it

```
npm install endpointsjs
```

## Usage

Use Endpoints to create an endpoint pattern, then call methods on that pattern to get promises back. Simple as that.

```javascript
var Endpoints = require('endpointsjs');

var myEndpoint = new Endpoints.GetPost({
  url: '/some/url',
  dataType: 'json'
});

var promiseCallback = function(endpoint) {
  console.log(endpoint.data);
  assert(endpoint === myEndpoint);
};

myEndpoint.get()
.then(promiseCallback);
```

It is also possible to create a custom endpoint pattern.

```javascript
var Endpoints = require('endpointsjs');

var myOtherEndpoint = new Endpoints.Custom({
  url: '/some/other/url',
  methodList: ['options', 'post', 'delete']
});

var promiseCallback = function(endpoint) {
  console.log(endpoint.data);
};

myOtherEndpoint.post({data: {myData: 123}})
.then(promiseCallback)
.then(myOtherEndpoint.delete);
```

Underneath Endpoints is using [jQuery.ajax](http://api.jquery.com/jquery.ajax/), so the options hash sent to
Endpoints.Whatever will take any valid [jQuery.ajax](http://api.jquery.com/jquery.ajax/) option.

### Available Endpoint Patterns

```
GetPost [GET, POST, OPTIONS]
GetPutDelete [GET, PUT, DELETE, OPTIONS]
GetPut [GET, PUT, OPTIONS]
Custom options.methodList
```

### Is Endpoints Right for my API?

Endpoints makes assumptions about APIs and Services. Most of these assumptions
are derived from the [REST style architecture](http://www.restapitutorial.com/).
Here is a list of them:
* APIs are stateless
* API endpoints return a resource representation after GET, POST, or PUT
* Content-Type is specified in the response
* Your API makes JSON and/or XML first class citizens

If your API does not closely follow REST, Endpoints probably isn't right for you.

If your API closely follows REST, have fun.
