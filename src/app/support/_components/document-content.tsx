import React, { useState } from 'react';
import { FaDownload, FaExpand, FaCompress, FaChevronLeft, FaChevronRight, FaSearch, FaSearchMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const PdfViewer = dynamic(() => import('@/components/pdf-viewer'), {
  ssr: false,
});

const DocumentContent = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <motion.div 
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center">Document Viewer</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-200 dark:bg-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Sample Document</h2>
          <div className="flex space-x-2">
            <button onClick={() => setScale(scale + 0.1)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              <FaSearch />
            </button>
            <button onClick={() => setScale(scale - 0.1)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              <FaSearchMinus />
            </button>
            <button onClick={toggleFullscreen} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
            <a href="/global/pdfs/TopoDOT_TechNote_1021_Requirements_Metrics_QB.pdf" download className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              <FaDownload />
            </a>
          </div>
        </div>
        <div className="pdf-container p-4">
          <PdfViewer
            file="/global/pdfs/TopoDOT_TechNote_1021_Requirements_Metrics_QB.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            pageNumber={pageNumber}
            scale={scale}
          />
        </div>
        <div className="p-4 bg-gray-200 dark:bg-gray-700 flex justify-between items-center">
          <button 
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            <FaChevronLeft />
          </button>
          <p className="text-lg">
            Page {pageNumber} of {numPages}
          </p>
          <button 
            onClick={() => changePage(1)} 
            disabled={pageNumber >= numPages}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Document Information</h2>
        <p className="mb-2"><span className="font-semibold">Title:</span> Sample Document</p>
        <p className="mb-2"><span className="font-semibold">Author:</span> John Doe</p>
        <p className="mb-2"><span className="font-semibold">Date:</span> August 7, 2024</p>
        <p><span className="font-semibold">Description:</span> This is a sample document showcasing our PDF viewer capabilities.</p>
      </div>
    </motion.div>
  );
};

export default DocumentContent;