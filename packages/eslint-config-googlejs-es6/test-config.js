const configTester = require('eslint-config-tester');

configTester.testConfig('./tests/**/*.js', {
  eslintOptions: {
    configFile: './index.js',
    useEslintrc: false,
  },
  mochaOptions: {
    reporter: 'list',
    useColors: false,
  },
});
