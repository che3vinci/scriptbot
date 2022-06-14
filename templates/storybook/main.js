// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  async viteFinal(config, { configType }) {
    config.resolve.alias.foo = 'bar';
    config.resolve.alias = {
      '@c3/utils': path.resolve(__dirname, '../../utils/src/'),
      '@c3/dom': path.resolve(__dirname, '../../dom/src/'),
      '@c3/hooks': path.resolve(__dirname, '../../hooks/src/'),
      '@c3/uikits': path.resolve(__dirname, '../../uikits/src/'),
      '@c3/css': path.resolve(__dirname, '../../css/src/'),
    };
    config.resolve.dedupe = ['@storybook/client-api'];

    return config;
  },
  typescript: {
    check: false,
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    // "@storybook/addon-interactions"
  ],
  framework: '@storybook/react',
  core: {
    builder: 'storybook-builder-vite',
  },
};
