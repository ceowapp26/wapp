const { parentPort, workerData } = require('worker_threads');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { runCLI } = require('jest');
const crypto = require('crypto');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function runTest(userId, componentName, code, test) {
  const tempDir = `temp-test/${userId}/${crypto.randomBytes(16).toString('hex')}`;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  try {
    const componentKey = `${tempDir}/${componentName}.tsx`;
    const testKey = `${tempDir}/${componentName}.test.tsx`;

    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: componentKey,
      Body: code,
    }));

    await s3Client.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: testKey,
      Body: test,
    }));

    const result = await runCLI(
      {
        runInBand: true,
        testMatch: [`s3://${bucketName}/${testKey}`],
        silent: true,
      },
      [`s3://${bucketName}/${tempDir}`]
    );

    if (!result || !result.results) {
      throw new Error('Unexpected test result structure');
    }

    const passed = result.results.success;
    let output = '';
    let errors = [];

    if (Array.isArray(result.results.testResults)) {
      output = result.results.testResults
        .map(tr => (tr.console && Array.isArray(tr.console)) ? tr.console.map(c => c.message).join('\n') : '')
        .join('\n');
      if (!passed) {
        errors = result.results.testResults
          .map(tr => tr.failureMessage)
          .filter(Boolean);
      }
    } else {
      throw new Error('Unexpected testResults structure');
    }

    return { passed, output, errors };
  } catch (error) {
    return { passed: false, output: '', errors: [error.message] };
  } finally {
    // Clean up S3 objects
    await s3Client.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: `${tempDir}/${componentName}.tsx`,
    }));
    await s3Client.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: `${tempDir}/${componentName}.test.tsx`,
    }));
  }
}

parentPort.on('message', async (message) => {
  const { userId, componentName, code, test } = message;
  try {
    const result = await runTest(userId, componentName, code, test);
    parentPort.postMessage({ success: true, result });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
});

