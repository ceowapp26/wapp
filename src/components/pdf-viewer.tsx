import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PdfProps {
  file: string;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  pageNumber: number;
  scale: number;
}

const PdfViewer: React.FC<PdfProps> = ({ file, onLoadSuccess, pageNumber, scale }) => {
  return (
    <div className="flex justify-center">
      <Document
        file={file}
        onLoadSuccess={onLoadSuccess}
        className="flex justify-center"
      >
        <Page pageNumber={pageNumber} scale={scale} className="shadow-lg" />
      </Document>
    </div>
  );
};

export default PdfViewer;
