Endpoints
=========

[![Build Status](https://travis-ci.org/kahnjw/endpoints.png)](https://travis-ci.org/kahnjw/endpoints)

Simple helper library for your service clients.

## Install it

```
npm install endpointsjs
```

## Usage

Use Endpoints to create an endpoint pattern, then call methods on that pattern to get promises back. Simple as that.

```javascript
var Endpoints = require('endpoints');

var promiseCallback = function(data) {
  console.log(data);
};

var myEndpoint = new Endpoints.GetPost({
  url: '/some/url',
  dataType: 'json'
});

var myOtherEndpoint = new Endpoints.Custom({
  url: '/some/other/url',
  methodList: ['OPTIONS', 'GET', 'DELETE']
});

myEndpoint.post({data: {my: 'data'}})
.then(promiseCallback);

myOtherEndpoint.get()
.then(promiseCallback)
.then(myOtherEndpoint.delete)
```

Underneath Endpoints is using [jQuery.ajax](http://api.jquery.com/jquery.ajax/), so the options hash sent to
Endpoints.Whatever will take any valid [jQuery.ajax](http://api.jquery.com/jquery.ajax/) option.

## Available Endpoint Patters

```
GetPost [GET, POST, OPTIONS]
GetPutDelete [GET, PUT, DELETE, OPTIONS]
GetPut [GET, PUT, OPTIONS]
Custom options.methodList
```