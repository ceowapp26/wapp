const { parentPort, workerData } = require('worker_threads');
const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const fs = require('fs').promises;
const path = require('path');
const { runCLI } = require('jest');
const crypto = require('crypto');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function runTest(userId, projectStructure) {
  const tempDir = `temp-test/${userId}/${crypto.randomBytes(16).toString('hex')}`;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  try {
    // Upload project structure to S3
    await uploadProjectToS3(projectStructure, tempDir, bucketName);

    // Run Jest on the entire project
    const result = await runCLI(
      {
        runInBand: true,
        testMatch: [`s3://${bucketName}/${tempDir}/**/*.test.{js,jsx,ts,tsx}`],
        silent: true,
      },
      [`s3://${bucketName}/${tempDir}`]
    );

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
    await deleteProjectFromS3(tempDir, bucketName);
  }
}

async function uploadProjectToS3(projectStructure, tempDir, bucketName) {
  for (const [key, value] of Object.entries(projectStructure)) {
    if (typeof value === 'string') {
      const fileKey = `${tempDir}/${key}`;
      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: value,
      }));
    } else if (typeof value === 'object') {
      await uploadProjectToS3(value, `${tempDir}/${key}`, bucketName);
    }
  }
}

async function deleteProjectFromS3(tempDir, bucketName) {
  const listParams = {
    Bucket: bucketName,
    Prefix: tempDir,
  };

  const listedObjects = await s3Client.send(new ListObjectsV2Command(listParams));

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: bucketName,
    Delete: { Objects: [] },
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3Client.send(new DeleteObjectsCommand(deleteParams));

  if (listedObjects.IsTruncated) await deleteProjectFromS3(tempDir, bucketName);
}

parentPort.on('message', async (message) => {
  const { userId, projectStructure } = message;
  try {
    const result = await runTest(userId, projectStructure);
    parentPort.postMessage({ success: true, result });
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message });
  }
});