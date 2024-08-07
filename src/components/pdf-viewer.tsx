"use client"
import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

interface PdfProps {
  file: string;
  onLoadSuccess?: (numPages: number) => void;
  initialPageNumber?: number;
  initialScale?: number;
}

const PdfViewer: React.FC<PdfProps> = ({ 
  file, 
  onLoadSuccess, 
  initialPageNumber = 1, 
  initialScale = 1.0 
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(initialPageNumber);
  const [scale, setScale] = useState(initialScale);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
    if (onLoadSuccess) {
      onLoadSuccess(numPages);
    }
  };

  const handleError = (error: Error) => {
    console.error('Error while loading PDF:', error);
    setError(error);
  };

  if (error) {
    return <div>Error loading PDF: {error.message}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <Document
        file={file}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleError}
        className="flex justify-center"
        loading="Loading PDF..."
      >
        {numPages && (
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            className="shadow-lg"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        )}
      </Document>
      {numPages && (
        <div className="mt-4">
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button 
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            Previous
          </button>
          <button 
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
          >
            Next
          </button>
          <button onClick={() => setScale(prev => prev + 0.1)}>Zoom In</button>
          <button onClick={() => setScale(prev => Math.max(prev - 0.1, 0.1))}>Zoom Out</button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;