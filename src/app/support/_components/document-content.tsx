import React, { useState, useCallback, useEffect } from 'react';
import { FaDownload, FaExpand, FaCompress, FaChevronLeft, FaChevronRight, FaSearch, FaSearchMinus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/components/pdf-viewer'), {
  ssr: false,
});

const DocumentContent = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((error) => {
    console.error('Error while loading document:', error);
    setError('Failed to load the document. Please try again later.');
  }, []);

  const changePage = useCallback((offset) => {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return numPages ? Math.min(Math.max(1, newPageNumber), numPages) : 1;
    });
  }, [numPages]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const adjustScale = useCallback((delta) => {
    setScale(prevScale => Math.min(Math.max(prevScale + delta, 0.5), 2));
  }, []);

  useEffect(() => {
    if (numPages && (pageNumber < 1 || pageNumber > numPages)) {
      setPageNumber(1);
    }
  }, [numPages, pageNumber]);

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <motion.div 
      className="w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 p-2 sm:p-4 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        Document Viewer
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-2 bg-gray-50 dark:bg-gray-750 flex flex-wrap justify-between items-center gap-2">
          <h2 className="text-sm sm:text-base font-semibold">WAPP Guide</h2>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <ControlButton onClick={() => adjustScale(0.1)} icon={<FaSearch />} tooltip="Zoom In" />
            <ControlButton onClick={() => adjustScale(-0.1)} icon={<FaSearchMinus />} tooltip="Zoom Out" />
            <ControlButton onClick={toggleFullscreen} icon={isFullscreen ? <FaCompress /> : <FaExpand />} tooltip={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} />
            <ControlButton href="/global/pdfs/WAPP-GUIDE.pdf" download icon={<FaDownload />} tooltip="Download PDF" />
          </div>
        </div>
        <div className="max-w-full">
          <PdfViewer
            file="/global/pdfs/WAPP-GUIDE.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            pageNumber={pageNumber}
            scale={scale}
          />
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-750 flex justify-between items-center">
          <ControlButton 
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1}
            icon={<FaChevronLeft />}
            tooltip="Previous Page"
          />
          <p className="text-xs sm:text-sm font-medium">
            {numPages ? `Page ${pageNumber} of ${numPages}` : 'Loading...'}
          </p>
          <ControlButton 
            onClick={() => changePage(1)} 
            disabled={pageNumber >= numPages}
            icon={<FaChevronRight />}
            tooltip="Next Page"
          />
        </div>
      </div>
      <motion.div 
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <button 
          onClick={() => setShowInfo(!showInfo)} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out text-sm sm:text-base"
        >
          {showInfo ? "Hide" : "Show"} Document Information
        </button>
        <AnimatePresence>
          {showInfo && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md overflow-hidden"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Document Information</h2>
              <InfoItem label="Title" value="WAPP Guide" />
              <InfoItem label="Author" value="WAPP Admin" />
              <InfoItem label="Date" value="August 7, 2024" />
              <InfoItem label="Description" value="This is a comprehensive guide to WAPP, covering all essential aspects and features." />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const ControlButton = ({ onClick, disabled, icon, tooltip, href }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`p-1 sm:p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={onClick}
    disabled={disabled}
    title={tooltip}
  >
    {href ? (
      <a href={href} download className="flex items-center justify-center">
        {icon}
      </a>
    ) : (
      icon
    )}
  </motion.button>
);

const InfoItem = ({ label, value }) => (
  <p className="mb-1 text-xs sm:text-sm">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

export default DocumentContent;

