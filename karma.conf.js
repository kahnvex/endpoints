'use strict';


module.exports = function(config) {
  var configuration = {
    frameworks: ['mocha', 'browserify'],
    browsers: ['PhantomJS'],
    preprocessors: {
      'test/integration/*-spec.js': ['browserify']
    },
    browserify: {
      debug: true,
      watch: true
    },
    files: [
      'test/integration/*-spec.js',
      {
        pattern: 'test/**/*.json',
        watched: true,
        served:  true,
        included: false
      }
    ],
    singleRun: true
  };

  config.set(configuration);
};
