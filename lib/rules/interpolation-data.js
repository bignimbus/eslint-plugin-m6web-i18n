'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var minimatch = require('minimatch');

var _require = require('../utils/utils'),
    getKeyValue = _require.getKeyValue,
    get = _require.get,
    getLangConfig = _require.getLangConfig;

module.exports = {
  meta: {
    docs: {
      description: 'ensures that interpolated translate key have data',
      category: 'Possible errors'
    },
    schema: [{
      type: 'object',
      required: ['interpolationPattern'],
      properties: {
        interpolationPattern: {
          type: 'string'
        }
      },
      additionalProperties: false
    }]
  },
  create: function create(context) {
    var config = context.settings.i18n;

    if (!config || config.ignoreFiles && minimatch(context.getFilename(), config.ignoreFiles)) {
      return {};
    }

    return {
      CallExpression: function CallExpression(node) {
        var funcName = node.callee.type === 'MemberExpression' && node.callee.property.name || node.callee.name;

        if (funcName !== config.functionName || !node.arguments || !node.arguments.length) {
          return;
        }

        var _node$arguments = _slicedToArray(node.arguments, 3),
            keyNode = _node$arguments[0],
            dataNode = _node$arguments[1],
            countNode = _node$arguments[2];

        var key = getKeyValue(keyNode);

        if (!key) {
          return;
        }

        getLangConfig(config, 'principalLangs').forEach(function (_ref) {
          var translation = _ref.translation;

          if (!translation) {
            return;
          }

          var isPluralized = !!countNode && Array.isArray(config.pluralizedKeys);
          var translateValue = get(translation, key);

          var _context$options = _slicedToArray(context.options, 1),
              interpolationPattern = _context$options[0].interpolationPattern;

          var interpolationTester = new RegExp(interpolationPattern);

          var values = void 0;
          if (isPluralized) {
            values = Object.values(translateValue);
          } else {
            values = translateValue ? [translateValue] : [];
          }

          if ((!dataNode || dataNode.name === 'undefined') && values.some(function (value) {
            return interpolationTester.test(value);
          })) {
            context.report({
              node: node,
              severity: 2,
              message: '\'' + key + '\' requires interpolation data.'
            });

            return;
          }

          if (dataNode && dataNode.name !== 'undefined' && !values.some(function (value) {
            return interpolationTester.test(value);
          })) {
            context.report({
              node: node,
              severity: 2,
              message: '\'' + key + '\' doesn\'t require any interpolation data.'
            });
          }
        });
      }
    };
  }
};