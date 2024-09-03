'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { UploadCloudIcon, X, FileAudio2, Trash2, Headphones, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Tooltip, Spinner, Progress } from "@nextui-org/react";
import { toast } from 'sonner';

const variants = {
  base: 'relative rounded-xl flex justify-center items-center flex-col cursor-pointer min-h-[250px] min-w-[300px] border-2 border-dashed transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-800',
  active: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30',
  disabled: 'bg-gray-100 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700',
  accept: 'border-green-500 bg-green-50 dark:bg-green-900/30',
  reject: 'border-red-500 bg-red-50 dark:bg-red-900/30',
};

const AudioUploadDropzone = React.forwardRef(({ className, handleInsertFiles, ...props }, ref) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map(file => ({
        file,
        size: file.size,
        type: 'audio',
        preview: URL.createObjectURL(file),
        content: null,
      }));

      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setIsUploading(true);

      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      await new Promise(resolve => setTimeout(resolve, 1000));
      clearInterval(uploadInterval);
      setUploadProgress(100);
      setIsUploading(false);

    } else {
      toast.error("No valid audio files were uploaded. Please try again.");
    }
  }, []);

  const transcribeAudio = async (newFiles) => {
    setIsTranscribing(true);
    const progressInterval = setInterval(() => {
      setTranscriptionProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const results = await Promise.all(
        newFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("audio", file.file);
          const response = await fetch("/api/transcribe_openai", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) throw new Error(`Failed to process ${file.file.name}`);
          const data = await response.json();
          return { ...file, content: data.transcription };
        })
      );

      setFiles(currentFiles => 
        currentFiles.map(file => 
          results.find(result => result.file.name === file.file.name) || file
        )
      );

      toast.success("Audio transcription completed successfully!");
    } catch (error) {
      toast.error("An error occurred during transcription.");
    } finally {
      setTranscriptionProgress(100);
      clearInterval(progressInterval);
      setIsTranscribing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {'audio/*': []},
    maxSize: 50 * 1024 * 1024,
    multiple: props?.multiple,
  });

  const dropZoneClassName = useMemo(
    () =>
      twMerge(
        variants.base,
        isDragActive && variants.active,
        isDragAccept && variants.accept,
        isDragReject && variants.reject,
        (isUploading || isTranscribing) && variants.disabled,
      ),
    [isDragActive, isDragAccept, isDragReject, isUploading, isTranscribing],
  );

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  return (
    <div className="relative">
      <motion.div
        {...getRootProps({
          className: dropZoneClassName,
        })}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />

        <AnimatePresence>
          {files.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full p-6 overflow-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="relative p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center mb-3">
                    <FileAudio2 className="w-6 h-6 text-blue-500 mr-2" />
                    <h3 className="font-semibold truncate text-gray-700 dark:text-gray-200">{file.file.name}</h3>
                  </div>
                  <div className="h-24 mb-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    {!file.content ? (
                      <audio src={file.preview} controls className="w-full" />
                    ) : (
                      <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-inner leading-relaxed max-h-24 overflow-y-auto">
                        {file.content}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    {file.content ? (
                      <Tooltip content="Transcribed">
                        <FileText className="w-5 h-5 text-green-500" />
                      </Tooltip>
                    ) : (
                      <Tooltip content="Audio file">
                        <Headphones className="w-5 h-5 text-blue-500" />
                      </Tooltip>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Tooltip content="Remove file">
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
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
              <UploadCloudIcon className="mb-4 h-12 w-12 text-blue-500" />
              <p className="text-center text-lg font-semibold">
                Drag & drop your audio here
              </p>
              <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
                Or click to select files
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                MP3, WAV, AAC up to 50MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          {(!isTranscribing && transcriptionProgress !== 100) ? (
            <Button
              color="primary"
              className="w-full sm:w-auto px-8 py-2 rounded-full"
              onClick={() => transcribeAudio(files)}
              startContent={<FileText className="w-5 h-5" />}
            >
              Transcribe Audios
            </Button>
          ) : (
            <Button
              color="success"
              className="w-full sm:w-auto px-8 py-2 rounded-full"
              onClick={() => {
                handleInsertFiles(files);
                setFiles([]);
              }}
              startContent={<UploadCloudIcon className="w-5 h-5" />}
            >
              Insert Files
            </Button>
          )}
          <Button
            color="danger"
            variant="flat"
            className="w-full sm:w-auto px-8 py-2 rounded-full"
            onClick={clearAllFiles}
            startContent={<Trash2 className="w-5 h-5" />}
          >
            Clear All
          </Button>
        </motion.div>
      )}
      {(isUploading || isTranscribing) && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center rounded-xl">
          <Spinner color="white" size="lg" />
          <Progress
            size="sm"
            isIndeterminate={false}
            value={isUploading ? uploadProgress : transcriptionProgress}
            color="primary"
            className="max-w-md mt-4"
          />
          <p className="text-white mt-4 font-medium">
            {isUploading ? `Uploading audio... ${uploadProgress}%` : `Processing audio... ${transcriptionProgress}%`}
          </p>
        </div>
      )}
    </div>
  );
});

AudioUploadDropzone.displayName = 'AudioUploadDropzone';

export { AudioUploadDropzone };