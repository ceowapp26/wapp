import React, { useState, useMemo } from 'react';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  ScrollShadow
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, Trash2 } from 'lucide-react';
import { FiFile, FiBox } from "react-icons/fi";
import { FileInterface } from "@/types/chat";
import ResourceTabs from './resource-tabs';

function extractTextContent(node: any): string {
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }

  if (typeof node === 'object' && node !== null) {
    if (node.type === 'text') {
      return node.text || '';
    }
    if (node.content) {
      return extractTextContent(node.content);
    }
  }

  return '';
}

function processJson(jsonString: string): string {
  try {
    const data = JSON.parse(jsonString);
    if (data.content) {
      const textContent = extractTextContent(data.content);
      return textContent.trim();
    } else {
      return "No content found in the JSON structure.";
    }
  } catch (error) {
    return "Invalid JSON string.";
  }
}

interface SystemFileProps {
  handleFilesProcessed: (files: FileInterface[]) => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SystemFile: React.FC<SystemFileProps> = ({ handleFilesProcessed, setIsModalOpen }) => {
  const [files, setFiles] = useState<FileInterface[]>([]);
  const documents = useQuery(api.documents.getDocumentSearch) || [];
  const projects = useQuery(api.codes.getProjectList) || [];
  const chats = useQuery(api.chats.getActiveChats) || [];

  const handleFileSelect = (file: FileInterface) => {
    setFiles(prevFiles => [...prevFiles, file]);
  };

  const handleInsertFiles = () => {
    if (files.length > 0) {
      handleFilesProcessed(files);
      setFiles([]);
      setIsModalOpen(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const chatResources = useMemo(() => 
    chats.map(chat => ({
      name: chat.chatTitle,
      type: "text",
      content: chat.messages.map((msg: any) => `${msg.content} ${msg.embeddedContent.map((file: any) => file.content).join(' ')}`).join('\n'),
      size: 0,
    })), [chats]
  );

  const documentResources = useMemo(() => 
    documents.map(document => ({
      name: document.title,
      type: "text",
      content: processJson(document.content),
      size: 0,
    })), [documents]
  );

  const resources = {
    chats: chatResources,
    documents: documentResources,
    codes: projects,
    audios: [
      { name: "Voiceover.mp3", type: "MP3", content: "Yesterday", size: 0 },
      { name: "Animation.mp3", type: "MP3", content: "3 days ago", size: 0 },
    ],
    images: [
      { name: "AI.png", type: "PNG", content: "Yesterday", size: 0 },
      { name: "Future.jpg", type: "JPG", content: "3 days ago", size: 0 },
    ],
    videos: [
      { name: "AI.mp4", type: "MP4", content: "Yesterday", size: 0 },
      { name: "Future.mp4", type: "MP4", content: "3 days ago", size: 0 },
    ],
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center space-x-3 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
        <FiBox className="w-6 h-6" />
        <span className="text-xl font-semibold tracking-wide">System File</span>
        <div className="flex-grow" />
        <Popover>
          <PopoverTrigger>
            <Button 
              auto 
              light
              className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 text-white border border-white border-opacity-30"
            >
              View Selected Files
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="relative">
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
                          <FiFile className="w-6 h-6 text-blue-500 mr-2" />
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
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center h-64 text-center"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        times: [0, 0.2, 0.5, 0.8, 1],
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      <FiFile className="w-16 h-16 text-gray-400 mb-4" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2"
                    >
                      No files selected
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Select files from the list to see them here
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
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
                      onClick={handleInsertFiles}
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
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <ResourceTabs resources={resources} handleFileSelect={handleFileSelect} />
    </div>
  );
};

export default SystemFile;
