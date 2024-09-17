import React, { useState, useRef, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Switch } from '@nextui-org/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Maximize2, Minimize2 } from 'lucide-react';
import PromptBox from './prompt-box';
import EnhancedMarkdown from "./enhanced-markdown";
import EnhancedTextDisplay from "./enhanced-textdisplay";
import ChatAvatar from './chat-avatar';
import { MessageInterface, FileInterface } from "@/types/chat";
import { usePortalContext } from "@/context/portal-context-provider";
import ActionButtonGroup from "./action-button-group";
import ErrorContainer from "./error-container";

interface EditorChatbotProps {
  content: string;
  isOpen: boolean;
  onOpenChange: () => void;
  setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  setCurrentComponent?: React.Dispatch<React.SetStateAction<string>>;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<any>>;
  handleReplaceCode?: (content: string) => void;
  handleInsertAboveCode?: (content: string) => void;
  handleInsertBelowCode?: (content: string) => void;
  handleInsertLeftCode?: (content: string) => void;
  handleInsertRightCode?: (content: string) => void;
  position?: { top: number; left: number };
}

const EditorChatbot: React.FC<EditorChatbotProps> = ({ 
  content, 
  isOpen, 
  onOpenChange,
  setCurrentEmbeddedFile,
  setCurrentComponent,
  setCurrentCodeFile,
  handleReplaceCode,
  handleInsertLeftCode,
  handleInsertAboveCode,
  handleInsertBelowCode,
  handleInsertRightCode,
  position 
}) => {
  const { chatHistory, setChatHistory } = usePortalContext();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [markdownMode, setMarkdownMode] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const regenerateRef = useRef<() => void>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const lastMessageIndex = chatHistory.length > 0 ? chatHistory.length - 1 : 0;

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleDelete = (index: number) => {
    setChatHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleRegenerate = () => {
    if (regenerateRef.current) {
      regenerateRef.current();
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size={isExpanded ? "full" : "4xl"}
      scrollBehavior="inside"
      classNames={{
        wrapper: "items-start justify-start",
        base: `z-[999999] ${isExpanded ? "" : `top-[${position?.top}px] left-[${position?.left}px]`}`,
      }}
    >
      <ModalContent>
        {(onClose) => (
          <div className={`${isDarkMode ? 'dark' : ''}`}>
            <div className="bg-white dark:bg-gray-800 transition-colors duration-200">
              <ModalHeader className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Chat Support</h2>
                <div className="flex items-center space-x-4">
                  <Button
                    isIconOnly
                    color="primary"
                    variant="light"
                    onPress={toggleDarkMode}
                    aria-label="Toggle dark mode"
                  >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </Button>
                  <Button
                    isIconOnly
                    color="primary"
                    variant="light"
                    onPress={toggleExpand}
                    aria-label="Toggle expand"
                  >
                    {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody>
                <div 
                  ref={chatContainerRef}
                  className="flex flex-col h-full max-h-[60vh] gap-y-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-y-auto transition-colors duration-200"
                >
                  <AnimatePresence>
                    {chatHistory.map((msg, index) => (
                      <motion.div
                        key={index}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`
                            flex items-start gap-x-2 max-w-[80%] 
                            ${msg.role === 'user' 
                              ? 'flex-row-reverse bg-blue-300 dark:bg-blue-500 text-white' 
                              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
                            } 
                            p-4 rounded-lg shadow-md transition-colors duration-200
                          `}
                        >
                          <ChatAvatar role={msg.role} className="w-10 h-10 flex-shrink-0" />
                          <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <span className={`text-sm font-semibold mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'} w-full`}>
                              {msg.role === 'user' ? 'You' : 'Assistant'}
                            </span>
                            {markdownMode ? (
                              <EnhancedMarkdown 
                                generating={generating}
                                content={msg.content}
                                role={msg.role} 
                                messageIndex={index}
                                lastMessageIndex={lastMessageIndex}
                                embeddedContent={msg.embeddedContent}
                                setCurrentEmbeddedFile={setCurrentEmbeddedFile}
                                setCurrentCodeFile={setCurrentCodeFile}
                                setCurrentComponent={setCurrentComponent}
                                handleReplaceCode={handleReplaceCode}
                                handleInsertAboveCode={handleInsertAboveCode}
                                handleInsertBelowCode={handleInsertBelowCode}
                                handleInsertLeftCode={handleInsertLeftCode}
                                handleInsertRightCode={handleInsertRightCode}
                              />
                            ) : (
                              <EnhancedTextDisplay generating={generating} content={msg.content} />              
                            )}
                            <ActionButtonGroup 
                              isMarkdownMode={markdownMode}
                              onMarkdownModeToggle={() => setMarkdownMode(!markdownMode)}
                              onReplace={() => handleReplaceCode?.(msg.content)}
                              onInsertAbove={() => handleInsertAboveCode?.(msg.content)}
                              onInsertBelow={() => handleInsertBelowCode?.(msg.content)}
                              onInsertLeft={() => handleInsertLeftCode?.(msg.content)}
                              onInsertRight={() => handleInsertRightCode?.(msg.content)}
                              onDelete={() => handleDelete(index)}
                              onCopy={() => handleCopy(msg.content)}
                              {...(msg.role === 'assistant' ? { onRegenerate: () => handleRegenerate() } : {})} 
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <PromptBox 
                  generating={generating}
                  setGenerating={setGenerating}
                  error={error}
                  setError={setError}
                  content={content} 
                  setCurrentComponent={setCurrentComponent} 
                  setCurrentEmbeddedFile={setCurrentEmbeddedFile} 
                  setCurrentCodeFile={setCurrentCodeFile} 
                  regenerateRef={regenerateRef}
                />
                {error && <ErrorContainer error={error} setError={setError} />}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditorChatbot;