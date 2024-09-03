import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { motion } from 'framer-motion';

interface PdfProps {
  file: string;
  onLoadSuccess?: ({ numPages }: { numPages: number }) => void;
  onLoadError?: (error: Error) => void;
  pageNumber: number;
  scale: number;
}

const PdfViewer: React.FC<PdfProps> = ({ 
  file, 
  onLoadSuccess, 
  onLoadError,
  pageNumber,
  scale: initialScale
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scale, setScale] = useState(initialScale);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 400) {
      setScale(initialScale * 0.7);
    } else if (windowWidth < 768) {
      setScale(initialScale * 0.85);
    } else {
      setScale(initialScale);
    }
  }, [windowWidth, initialScale]);

  const pageWidth = Math.min(windowWidth * 0.95, 800);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-full overflow-x-auto px-2">
      <Document
        file={file}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        className="flex justify-center w-full"
        loading={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-64 w-full"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </motion.div>
        }
      >
        <motion.div
          key={pageNumber}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-full items-center flex justify-center py-4"
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            className="shadow-2xl rounded-lg overflow-hidden max-w-full"
            renderTextLayer={true}
            renderAnnotationLayer={true}
            width={pageWidth}
          />
        </motion.div>
      </Document>
    </div>
  );
};

export default PdfViewer;