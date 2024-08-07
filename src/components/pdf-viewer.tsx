"use client"
import React, { useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

interface PdfProps {
  file: string;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
  pageNumber: number;
  scale: number;
}

const PdfViewer: React.FC<PdfProps> = ({ file, onLoadSuccess, pageNumber, scale }) => {
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

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
