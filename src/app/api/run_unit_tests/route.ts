import { NextRequest, NextResponse } from 'next/server';
import { Worker } from 'worker_threads';
import path from 'path';

const workerPool = [];
const MAX_WORKERS = 100; // Adjust based on your server capacity
const WORKER_TIMEOUT = 30000; // 30 seconds timeout

function getWorker() {
  if (workerPool.length < MAX_WORKERS) {
    const worker = new Worker(path.join(process.cwd(), 'workers', 'unit-test-runner.js'));
    workerPool.push(worker);
    return worker;
  }
  return workerPool[Math.floor(Math.random() * workerPool.length)];
}

export async function POST(req: NextRequest) {
  try {
    const { userId, componentName, code, test } = await req.json();

    const worker = getWorker();

    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Test execution timed out'));
      }, WORKER_TIMEOUT);

      worker.once('message', (message) => {
        clearTimeout(timeout);
        if (message.success) {
          resolve(message.result);
        } else {
          reject(new Error(message.error));
        }
      });

      worker.postMessage({ userId, componentName, code, test });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}