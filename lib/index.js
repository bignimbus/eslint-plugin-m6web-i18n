'use strict';

var noUnknownKey = require('./rules/no-unknown-key');
var noTextAsChildren = require('./rules/no-text-as-children');
var interpolationData = require('./rules/interpolation-data');
var noTextAsAttribute = require('./rules/no-text-as-attribute');

module.exports = {
  rules: {
    'no-unknown-key': noUnknownKey('principalLangs'),
    'no-unknown-key-secondary-langs': noUnknownKey('secondaryLangs'),
    'no-text-as-attribute': noTextAsAttribute,
    'no-text-as-children': noTextAsChildren,
    'interpolation-data': interpolationData
  }
};