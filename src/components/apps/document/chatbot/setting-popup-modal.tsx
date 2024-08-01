import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingPopupModal = ({
  title = 'Information',
  message,
  isModalOpen,
  setIsModalOpen,
  handleConfirm,
  handleClose,
  handleClickBackdrop,
  cancelButton = true,
  children,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef(null);

  const _handleClose = () => {
    handleClose && handleClose();
    setIsModalOpen(false);
  };

  const _handleBackdropClose = (e) => {
    if (e.target === modalRef.current) {
      if (handleClickBackdrop) handleClickBackdrop();
      else _handleClose();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (handleClickBackdrop) handleClickBackdrop();
      else handleClose ? handleClose() : setIsModalOpen(false);
    } else if (event.key === 'Enter') {
      if (handleConfirm) handleConfirm();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleConfirm, handleClose, handleClickBackdrop]);

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          ref={modalRef}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={_handleBackdropClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-[#19172c] text-[#a8b0d3] rounded-lg shadow-xl w-full max-w-md"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="border-b border-[#292f46] px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <button
                onClick={_handleClose}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {message && (
                <p className="text-gray-300 text-base mb-4">{message}</p>
              )}
              {children}
            </div>
            <div className="border-t border-[#292f46] px-6 py-4 flex justify-end space-x-2">
              {cancelButton && (
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-150 ease-in-out flex items-center"
                  onClick={_handleClose}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('cancel')}
                </button>
              )}
              {handleConfirm && (
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-150 ease-in-out"
                  onClick={handleConfirm}
                >
                  {t('confirm')}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingPopupModal;