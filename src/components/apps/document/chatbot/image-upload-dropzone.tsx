'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { UploadCloudIcon, X, CheckCircle, AlertCircle, Trash2, FileImage } from 'lucide-react';
import { Button, Tooltip, ScrollShadow } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  base: 'relative rounded-lg flex justify-center items-center flex-col cursor-pointer min-h-[200px] min-w-[300px] border-2 border-dashed transition-all duration-300 ease-in-out',
  image: 'border-0 p-0 min-h-0 min-w-0 relative shadow-lg rounded-lg overflow-hidden',
  active: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30',
  disabled: 'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
  accept: 'border-green-500 bg-green-50 dark:bg-green-900/30',
  reject: 'border-red-500 bg-red-50 dark:bg-red-900/30',
};

const UploadStatus = {
  IDLE: 'IDLE',
  UPLOADING: 'UPLOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const Toast = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none transition-colors duration-300"
        aria-label="Close notification"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

const ImageUploadDropzone = React.forwardRef(({ className, disabled, handleInsertFiles, ...props }, ref) => {
  const [uploadStatus, setUploadStatus] = useState(UploadStatus.IDLE);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setUploadStatus(UploadStatus.UPLOADING);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus(UploadStatus.SUCCESS);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    const newFiles = acceptedFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      content: URL.createObjectURL(file),
      preview: URL.createObjectURL(file),
      type: 'image'
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    setToast({ type: 'success', message: `${acceptedFiles.length} file(s) uploaded successfully` });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: { 'image/*': [] },
    multiple: props?.multiple,
    onDrop,
  });  

  const dropZoneClassName = useMemo(
    () =>
      twMerge(
        variants.base,
        isDragActive && variants.active,
        isDragAccept && variants.accept,
        isDragReject && variants.reject,
        disabled && variants.disabled,
        className,
      ).trim(),
    [isDragActive, isDragAccept, isDragReject, disabled, className],
  );

  const removeFile = useCallback((index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setToast({ type: 'success', message: 'File removed successfully' });
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
    setToast({ type: 'success', message: 'All files cleared' });
  }, []);

  return (
    <div>
      <div
        {...getRootProps({
          className: dropZoneClassName,
          style: { width: props.width, height: props.height },
        })}
      >
        <input ref={ref} {...getInputProps()} />

        <AnimatePresence>
          {files.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full p-4 overflow-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="relative p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center mb-2">
                    <FileImage className="w-6 h-6 text-blue-500 mr-2" />
                    <h3 className="font-semibold truncate text-gray-700 dark:text-gray-200">{file.name}</h3>
                  </div>
                  <ScrollShadow className="h-20 mb-2">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="h-full w-full object-cover rounded"
                    />
                  </ScrollShadow>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Tooltip content="Remove file">
                      <Button
                        isIconOnly
                        color="danger"
                        variant="flat"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </Tooltip>
                  </div>
                  {file.status === UploadStatus.SUCCESS && (
                    <div className="absolute bottom-2 right-2 text-green-500 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                  {file.status === UploadStatus.ERROR && (
                    <div className="absolute bottom-2 right-2 text-red-500 dark:text-red-400">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center text-sm text-gray-600 dark:text-gray-300"
            >
              <UploadCloudIcon className="mb-4 h-10 w-10" />
              <p className="text-center">
                Drag & drop your image here, or click to select
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, GIF up to 10MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Tooltip content="Insert Files">
            <Button
              color="primary"
              className="w-full sm:w-auto px-6 py-2"
              onClick={() => {
                handleInsertFiles(files);
                setFiles([]);
              }}
              aria-label="Insert Files"
            >
              Insert Files
            </Button>
          </Tooltip>
          {files.length > 1 && (
            <Tooltip content="Clear all">
              <Button
                color="danger"
                variant="flat"
                className="w-full sm:w-auto px-6 py-2"
                onClick={clearAllFiles}
                aria-label="Clear All"
              >
                Clear All
              </Button>
            </Tooltip>
          )}
        </motion.div>
      )}
      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>    
  );
});

ImageUploadDropzone.displayName = 'ImageUploadDropzone';

export { ImageUploadDropzone };