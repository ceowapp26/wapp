import React, { useState, useMemo, memo, Dispatch, SetStateAction } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { CodeFile } from "@/types/code";
import { FileInterface } from "@/types/chat";
import { usePortalContext } from "@/context/portal-context-provider";
import EnhancedMarkdown from "./enhanced-markdown";
import EnhancedTextDisplay from "./enhanced-textdisplay";
import ActionButtonGroup from "./action-button-group";
import ErrorContainer from "./error-container";

interface ContentViewProps {
  generating: boolean;
  isOpen: boolean;
  onModalClose: () => void;
  onOpenChange: (isOpen: boolean) => void;
  error?: string;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
  currentCodeFile?: CodeFile | null;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  currentEmbeddedFile?: FileInterface | null;
  setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  setCurrentComponent?: Dispatch<SetStateAction<string>>;
  handleRegenerate?: () => void;
  handleReplaceCode?: (content: string) => void;
  handleInsertAboveCode?: (content: string) => void;
  handleInsertBelowCode?: (content: string) => void;
  handleInsertLeftCode?: (content: string) => void;
  handleInsertRightCode?: (content: string) => void;
}

const ContentView: React.FC<ContentViewProps> = memo(({
  generating,
  isOpen,
  onModalClose,
  onOpenChange,
  error,
  setError,
  currentCodeFile,
  currentEmbeddedFile, 
  setCurrentCodeFile, 
  setCurrentEmbeddedFile,
  setCurrentComponent,
  handleRegenerate,
  handleReplaceCode,
  handleInsertLeftCode,
  handleInsertAboveCode,
  handleInsertBelowCode,
  handleInsertRightCode,
}) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(true);
  const { chatConversation } = usePortalContext();

  const memoizedContentViewProps = useMemo(() => {
    if (chatConversation.length === 2 && chatConversation[chatConversation.length - 1].role === "assistant") {
      return {
        role: chatConversation[chatConversation.length - 1].role,
        content: chatConversation[chatConversation.length - 1].content,
        embeddedContent: chatConversation[chatConversation.length - 1].embeddedContent,
        command: chatConversation[chatConversation.length - 1].command,
        context: chatConversation[chatConversation.length - 1].context,
        model: chatConversation[chatConversation.length - 1].model,
      };
    }
    return {
      role: "assistant",
      content: "",
      embeddedContent: [],
      command: "",
      context: "",
      model: "gpt-3.5-turbo",
    };
  }, [chatConversation]);

  const handleMarkdownModeToggle = () => setIsMarkdownMode(!isMarkdownMode);

  const handleCopy = () => {
    navigator.clipboard.writeText(memoizedContentViewProps.content);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      size="2xl"
    >
      <ModalContent>
        {({ onClose }) => (
          <>
            <ModalHeader className="flex flex-col gap-1 p-6">
              <span className={`px-2 py-1 rounded-full w-8 text-xs font-medium ${memoizedContentViewProps.role === 'assistant' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {memoizedContentViewProps.role === 'assistant' ? 'AI' : 'User'}
              </span>
            </ModalHeader>
            <ModalBody>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="prose dark:prose-invert max-w-none"
              >
                {isMarkdownMode ? (
                  <EnhancedMarkdown 
                    generating={generating}
                    content={memoizedContentViewProps.content}
                    role={memoizedContentViewProps.role} 
                    messageIndex={0}
                    lastMessageIndex={0}
                    embeddedContent={[]}
                    inlineLatex={false} 
                    isCode={true} 
                    handleReplaceCode={handleReplaceCode}
                    handleInsertAboveCode={handleInsertAboveCode}
                    handleInsertBelowCode={handleInsertBelowCode}
                    handleInsertLeftCode={handleInsertLeftCode}
                    handleInsertRightCode={handleInsertRightCode}
                    currentEmbeddedFile={currentEmbeddedFile}
                    setCurrentEmbeddedFile={setCurrentEmbeddedFile}
                    currentCodeFile={currentCodeFile}
                    setCurrentCodeFile={setCurrentCodeFile}
                    setCurrentComponent={setCurrentComponent}
                  />
                ) : (
                  <EnhancedTextDisplay generating={generating} content={memoizedContentViewProps.content} />              
                )}
              </motion.div>
              {error && <ErrorContainer error={error} setError={setError} />}
              <ActionButtonGroup 
                isMarkdownMode={isMarkdownMode}
                onMarkdownModeToggle={handleMarkdownModeToggle}
                onReplace={() => handleReplaceCode?.(memoizedContentViewProps.content)}
                onInsertAbove={() => handleInsertAboveCode?.(memoizedContentViewProps.content)}
                onInsertBelow={() => handleInsertBelowCode?.(memoizedContentViewProps.content)}
                onInsertLeft={() => handleInsertLeftCode?.(memoizedContentViewProps.content)}
                onInsertRight={() => handleInsertRightCode?.(memoizedContentViewProps.content)}
                onCopy={handleCopy}
                onRegenerate={handleRegenerate}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onModalClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

ContentView.displayName = 'ContentView';

export default ContentView;