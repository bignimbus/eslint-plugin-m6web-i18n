'use strict';

var fs = require('fs');
var path = require('path');

var recursiveGet = function recursiveGet(object, keys, index) {
  if (keys.length - index === 1) {
    return object[keys[index]];
  }

  return object[keys[index]] ? recursiveGet(object[keys[index]], keys, index + 1) : undefined;
};

exports.has = function (object, key) {
  return !!recursiveGet(object, key.split('.'), 0);
};

exports.get = function (object, key) {
  return recursiveGet(object, key.split('.'), 0);
};

exports.getKeyValue = function (key) {
  if (key.type === 'Literal') {
    return key.value;
  } else if (key.type === 'TemplateLiteral' && key.quasis.length === 1) {
    return key.quasis[0].value.cooked;
  }

  return null;
};

var expireAt = {};
var langConfig = {};

exports.getLangConfig = function (config, languagesKey) {
  if (!expireAt[languagesKey] || expireAt[languagesKey] <= Date.now() || config.disableCache) {
    langConfig[languagesKey] = config[languagesKey].map(function (_ref) {
      var name = _ref.name,
          translationPath = _ref.translationPath;

      try {
        var langFile = JSON.parse(fs.readFileSync(path.resolve(process.cwd() + '/' + translationPath)).toString());

        return {
          name: name,
          translation: langFile
        };
      } catch (e) {
        return {
          name: name,
          translation: null
        };
      }
    });
    expireAt[languagesKey] = Date.now() + (config.translationsCacheTTL || 500);
  }

  return langConfig[languagesKey];
};