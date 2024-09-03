'use client';

import { UploadCloudIcon, X, CheckCircle, AlertCircle } from 'lucide-react';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  base: 'relative rounded-lg flex justify-center items-center flex-col cursor-pointer min-h-[200px] min-w-[300px] border-2 border-dashed transition-all duration-300 ease-in-out',
  active: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30',
  disabled: 'bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
  accept: 'border-green-500 bg-green-50 dark:bg-green-900/30',
  reject: 'border-red-500 bg-red-50 dark:bg-red-900/30',
};

export const AudioUploadDropzone = ({ onUpload, isUploading, uploadProgress, isTranscribing, transcriptionProgress }) => {
  const onDrop = React.useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: {
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/aac': ['.aac'],
    },
    multiple: false,
    disabled: isUploading || isTranscribing,
    onDrop,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const dropZoneClassName = React.useMemo(
    () =>
      twMerge(
        variants.base,
        isDragActive && variants.active,
        isDragAccept && variants.accept,
        isDragReject && variants.reject,
        (isUploading || isTranscribing) && variants.disabled,
      ).trim(),
    [isDragActive, isDragAccept, isDragReject, isUploading, isTranscribing],
  );

return (
    <div className="relative">
      <motion.div
        {...getRootProps({
          className: dropZoneClassName,
        })}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />

        <AnimatePresence>
          {!isUploading && !isTranscribing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center text-sm text-gray-600 dark:text-gray-300"
            >
              <UploadCloudIcon className="mb-4 h-10 w-10" />
              <p className="text-center">
                Drag & drop your audio here, or click to select
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                MP3, WAV, AAC up to 50MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {(isUploading || isTranscribing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80"
          >
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
              <p className="text-blue-600 dark:text-blue-400">
                {isUploading ? `Uploading... ${uploadProgress}%` : `Transcribing... ${transcriptionProgress}%`}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};