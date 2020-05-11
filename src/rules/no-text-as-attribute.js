module.exports = {
  meta: {
    docs: {
      description: 'ensure that no plain text is used in attributes',
      category: 'Possible errors',
    },
    schema: [
      {
        type: 'object',
        properties: {
          attributes: {
            type: 'array',
            minItems: 1,
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const config = context.settings.i18n;
    const [options] = context.options;
    const { attributes } = options || {};

    if (config && config.ignoreFiles && minimatch(context.getFilename(), config.ignoreFiles)) {
      return {};
    }

    return {
      JSXAttribute(node) {
        attributes.forEach(attribute => {
          if (attribute === node.name.name && node.value.type === 'Literal') {
            context.report({
              node,
              message: `Untranslated JSX attribute ${attribute} with "${node.value.value}"`,
            });
          }
        });
      },
    };
  },
};
