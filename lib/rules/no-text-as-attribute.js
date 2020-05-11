'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

module.exports = {
  meta: {
    docs: {
      description: 'ensure that no plain text is used in attributes',
      category: 'Possible errors'
    },
    schema: [{
      type: 'object',
      properties: {
        attributes: {
          type: 'array',
          minItems: 1,
          items: { type: 'string' },
          uniqueItems: true
        }
      },
      additionalProperties: false
    }]
  },
  create: function create(context) {
    var _context$options = _slicedToArray(context.options, 1),
        options = _context$options[0];

    var _ref = options || {},
        attributes = _ref.attributes;

    return {
      JSXAttribute: function JSXAttribute(node) {
        attributes.forEach(function (attribute) {
          if (attribute === node.name.name && node.value.type === 'Literal') {
            context.report({
              node: node,
              message: 'Untranslated JSX attribute ' + attribute + ' with "' + node.value.value + '"'
            });
          }
        });
      }
    };
  }
};