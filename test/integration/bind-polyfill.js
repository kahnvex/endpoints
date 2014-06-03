'use strict';

var _ = require('lodash');


if (!Function.prototype.bind) {
  Function.prototype.bind = function (bindThis) {
    return _.bind(this, bindThis);
  };
}
