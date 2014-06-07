'use strict';


module.exports = function(config) {
  var configuration = {
    frameworks: ['mocha', 'browserify'],
    browsers: ['PhantomJS'],
    preprocessors: {
      '/**/*.browserify': 'browserify'
    },
    browserify: {
      files: ['test/browser-spec/*-spec.js'],
      debug: true,
      watch: true
    },
    reporters: ['spec'],
    files: [
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
