const configTester = require('eslint-config-tester');

const commandLineReporter = process.argv[2];

configTester.testConfig('./tests/**/*.js', {
  eslintOptions: {
    configFile: './index.js',
    useEslintrc: false,
  },
  mochaOptions: {
    reporter: commandLineReporter || 'spec',
    useColors: false,
  },
});
