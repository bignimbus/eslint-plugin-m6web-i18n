'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var minimatch = require('minimatch');

module.exports = {
  meta: {
    docs: {
      description: 'ensures that no plain text is used in JSX components',
      category: 'Possible errors'
    },
    schema: [{
      type: 'object',
      properties: {
        ignorePattern: {
          type: 'string'
        }
      },
      additionalProperties: false
    }]
  },
  create: function create(context) {
    var config = context.settings.i18n;

    if (config && config.ignoreFiles && minimatch(context.getFilename(), config.ignoreFiles)) {
      return {};
    }

    var _context$options = _slicedToArray(context.options, 1),
        options = _context$options[0];

    var _ref = options || {},
        ignorePattern = _ref.ignorePattern;

    return {
      JSXElement: function JSXElement(node) {
        node.children.forEach(function (child) {
          if (['Literal', 'JSXText'].indexOf(child.type) !== -1) {
            var text = child.value.trim().replace('\\n', '');
            if (text.length && (!ignorePattern || !new RegExp(ignorePattern).test(text))) {
              context.report({
                node: child,
                message: 'Untranslated text \'' + text + '\''
              });
            }
          }
        });
      }
    };
  }
};