Endpoints
=========

[![Build Status](https://travis-ci.org/kahnjw/endpoints.png)](https://travis-ci.org/kahnjw/endpoints)

Simple helper library for HTTP service clients. Endpoints works in the browser
and in Node, using [RequestAdapter](https://github.com/kahnjw/RequestAdapter/) to expose a common interface for Request Response objects, and [superagent](https://github.com/visionmedia/superagent) for Node and browser AJAX.

View the [Endpoints API Reference](https://github.com/kahnjw/endpoints/blob/0.3.0/api-reference.md).

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

## Development

Bug fixes, new features, doc fixes are welcome and ecouraged. Open your pull early, make sure the code lints without error and the tests pass.

### Setup

```
$ git clone git@github.com:kahnjw/endpoints.git
$ cd endpoints
$ npm install
```

### Lint and test

```
$ gulp lint
$ gulp browserspec
$ gulp nodespec
```

Or just use the watch task

```
$ gulp watch
```

If new features are added or a bug is fixed, please cover them with new tests.

### Footprint

Keep in mind this library is targeting both browser and Node environments.
Footprint size should be as small as possible. To help with this there is a
`footprint` task:

```
$ gulp footprint
[gulp] Using gulpfile ~/Documents/endpoints/gulpfile.js
[gulp] Starting 'footprint'...
[gulp] gulp-size: total 57.35 kB
index.js
└─┬ create.js
  ├─┬ http-method-helper.js
  │ └─┬ http-method.js
  │   ├── ../node_modules/lodash/dist/lodash.js
  │   ├─┬ ../node_modules/qagent/index.js
  │   │ └── ../node_modules/q/q.js
  │   └─┬ ../node_modules/superagent/lib/client.js
  │     ├── ../node_modules/superagent/node_modules/component-emitter/index.js
  │     └── ../node_modules/superagent/node_modules/reduce-component/index.js
  ├─┬ ../node_modules/requestadapter/src/index.js
  │ ├── ../node_modules/requestadapter/src/xhr-adapter.js
  │ └── ../node_modules/requestadapter/src/node-request-adapter.js
  └── ../node_modules/lodash/dist/lodash.js

[gulp] Finished 'footprint' after 1.4 s
```

This prints out the minified size of the library, and the dependency tree to
ensure that no libraries are double included.