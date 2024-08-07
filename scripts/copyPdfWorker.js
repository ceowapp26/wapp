// scripts/copyPdfWorker.js
import path from 'node:path';
import fs from 'node:fs';

const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const pdfWorkerPath = path.join(pdfjsDistPath, 'build', 'pdf.worker.min.mjs');

fs.copyFileSync(pdfWorkerPath, './public/pdf.worker.min.mjs');
