'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { FileUp, X, CheckCircle, AlertCircle, Trash2, FileText, Paperclip } from 'lucide-react';
import { cn, Button, Tooltip, ScrollShadow, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';

const variants = {
  base: 'relative rounded-lg flex justify-center items-center flex-col cursor-pointer min-h-[300px] max-h-[400px] overflow-auto w-full max-w-[600px] mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 transition-all duration-300 ease-in-out border-2 border-dashed border-gray-300 dark:border-gray-600',
  active: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30',
  disabled: 'opacity-50 cursor-default',
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
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

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

const FileUploadDropzone = React.forwardRef(({ handleInsertFiles, ...props }, ref) => {
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const newFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        try {
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          let content = '';

          switch (fileExtension) {
            case 'pdf':
              pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
              const arrayBuffer = await file.arrayBuffer();
              const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
              const numPages = pdf.numPages;

              for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                content += textContent.items.map(item => item.str).join(' ');
              }
              break;
            case 'csv':
            case 'txt':
            case 'html':
            case 'json':
            case 'docx':
            case 'xlsx':
            case 'py':      
            case 'java':    // Java files
            case 'c':       // C files
            case 'cpp':     // C++ files
            case 'hpp':     // C++ header files
            case 'rb':      // Ruby files
            case 'sh':      // Shell script files
            case 'md':      // Markdown files
            case 'css':     // CSS files
            case 'js':      // JavaScript files
            case 'ts':      // TypeScript files
            case 'php':     // PHP files
            case 'sql':     // SQL files
            case 'yaml':    // YAML files
            case 'yml':     // YAML files
            case 'xml':     // XML files
            case 'pas':     // Pascal files
            case 'pl':      // Perl files
            case 'jsx':     // JSX files (React components)
            case 'tsx':     // TSX files (TypeScript with JSX)
            case 'go':      // Go files
              content = await file.text();
              break;
            default:
              throw new Error('Unsupported file type');
          }

          return { file, content, name: file.name, size: file.size, type: "text", status: UploadStatus.SUCCESS };
        } catch (error) {
          console.error(error);
          return { file, status: UploadStatus.ERROR };
        }
      })
    );

    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    setToast({ type: 'success', message: `${newFiles.length} file(s) uploaded successfully` });
  }, []);  

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'text/html': ['.html'],
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'text/x-python': ['.py'],
      'text/x-java-source': ['.java'],
      'text/x-c': ['.c'],
      'text/x-c++': ['.cpp', '.hpp'],
      'text/x-ruby': ['.rb'],
      'text/x-sh': ['.sh'],
      'text/x-markdown': ['.md'],
      'text/x-css': ['.css'],
      'text/x-javascript': ['.js'],
      'text/x-typescript': ['.ts'],
      'text/x-html': ['.html'],
      'application/x-httpd-php': ['.php'],
      'text/x-sql': ['.sql'],
      'text/x-yaml': ['.yaml', '.yml'],
      'text/x-xml': ['.xml'],
      'application/x-ruby': ['.rb'],
      'text/x-pascal': ['.pas'],
      'text/x-perl': ['.pl'],
      'text/x-jsx': ['.jsx'],       
      'text/x-tsx': ['.tsx'],      
      'text/x-go': ['.go'],         
    },
    multiple: props.multiple,
    onDrop: onDrop,
    ...props.dropzoneOptions,
  });

  const dropZoneClassName = useMemo(
    () =>
      twMerge(
        variants.base,
        isDragActive && variants.active,
        isDragAccept && variants.accept,
        isDragReject && variants.reject,
        props.disabled && variants.disabled,
        props.className,
        'group'
      ).trim(),
    [isDragActive, isDragAccept, isDragReject, props.disabled, props.className],
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
    <div className="relative">
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
                    <FileText className="w-6 h-6 text-blue-500 mr-2" />
                    <h3 className="font-semibold truncate text-gray-700 dark:text-gray-200">{file.name}</h3>
                  </div>
                  {file.content && (
                    <ScrollShadow className="h-20 mb-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{file.content.substring(0, 150)}...</p>
                    </ScrollShadow>
                  )}
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
              className="flex flex-col items-center justify-center text-center p-8"
            >
              <FileUp className="mb-6 h-16 w-16 text-blue-500 dark:text-blue-400" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Drag & drop your files here
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                or click to select files
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Supported formats: DOCX, XLSX, TXT, HTML, JSON, CSV, PDF
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
            >
              Insert Files
            </Button>
          </Tooltip>
          
          {files.length > 1 && (
            <Tooltip content="Clear All Files">
              <Button
                color="danger"
                variant="flat"
                className="w-full sm:w-auto px-6 py-2"
                onClick={clearAllFiles}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Files
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

FileUploadDropzone.displayName = 'FileUploadDropzone';

export { FileUploadDropzone };


