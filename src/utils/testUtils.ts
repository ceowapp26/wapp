const jest = require('jest');
const { vol } = require('memfs');

async function runIntegrationTests(projectStructure) {
  // Create virtual directory structure
  vol.fromJSON(projectStructure, '/');

  // Run Jest
  try {
    const { results } = await jest.runCLI(
      {
        roots: ['/'],
        runInBand: true,
        testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      },
      ['/']
    );

    const success = results.success;
    let output = '';
    let errors = [];

    if (Array.isArray(results.testResults)) {
      output = results.testResults
        .flatMap(tr => tr.console || [])
        .map(c => c.message)
        .join('\n');

      if (!success) {
        errors = results.testResults
          .map(tr => tr.failureMessage)
          .filter(message => typeof message === 'string');
      }
    }

    return {
      success,
      output,
      errors,
    };
  } finally {
    // Clean up virtual file system
    vol.reset();
  }
}

// Example usage
const projectStructure = {
  'package.json': '{ "name": "my-project", ... }',
  'jest.config.js': 'module.exports = { ... }',
  'src/components/MyComponent.js': '// component code',
  'src/components/__tests__/MyComponent.test.js': '// test code',
  // ... other files and directories
};

runIntegrationTests(projectStructure)
  .then(results => {
    console.log(JSON.stringify(results));
  })
  .catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
  });