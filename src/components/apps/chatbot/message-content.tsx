import React, { useState } from 'react';
import ContentView from './content-view';
import ChatView from './chat-view';
import { FileInterface } from '@/types/chat';

const MessageContent = ({
  role,
  content,
  embeddedContent,
  command, 
  context, 
  model,
  messageIndex,
  sticky = false,
  isInsertedContent,
  insertedContent,
  setIsInsertedContent,
  setInsertedContent,
  currentCodeFile,
  setCurrentCodeFile,
  currentEmbeddedFile,
  setCurrentEmbeddedFile,
  setCurrentComponent,
  handleReplaceCode,
  handleInsertAboveCode,
  handleInsertBelowCode,
  handleInsertLeftCode,
  handleInsertRightCode,
  isCode,
  scrollContainerRef,
}: {
  role: string;
  content: string;
  embeddedContent: FileInterface[];
  command: string;
  context: string;
  model: string;
  messageIndex: number;
  sticky?: boolean;
  isInsertedContent?: boolean;
  insertedContent?: string;
  setInsertedContent?: React.Dispatch<React.SetStateAction<string>>;
  setIsInsertedContent?: React.Dispatch<React.SetStateAction<boolean>>;
  currentCodeFile?: CodeFile;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  currentEmbeddedFile?: FileInterface,
  setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  setCurrentComponent?: Dispatch<SetStateAction<string>>;
  handleReplaceCode?: (content: string) => void;
  handleInsertAboveCode?: (content: string) => void;
  handleInsertBelowCode?: (content: string) => void;
  handleInsertLeftCode?: (content: string) => void;
  handleInsertRightCode?: (content: string) => void;
  isCode?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;  
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(sticky);

  return (
    <div className='relative flex flex-col gap-2 md:gap-3 lg:w-[calc(100%-15px)]'>
      {isEdit ? (
        <ChatView
          content={content}
          command={command}
          context={context}
          model={model}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
          sticky={sticky}
          isCode={isCode}
          insertedContent={insertedContent}
          isInsertedContent={isInsertedContent}
          setIsInsertedContent={setIsInsertedContent}
          setInsertedContent={setInsertedContent}
          currentEmbeddedFile={currentEmbeddedFile}
          setCurrentCodeFile={setCurrentCodeFile}
          setCurrentEmbeddedFile={setCurrentEmbeddedFile}
          setCurrentComponent={setCurrentComponent}
        />
      ) : (
        <ContentView
          role={role}
          content={content}
          embeddedContent={embeddedContent}
          command={command}
          context={context}
          model={model}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
          isCode={isCode}
          currentCodeFile={currentCodeFile}
          setCurrentCodeFile={setCurrentCodeFile}
          currentEmbeddedFile={currentEmbeddedFile}
          setCurrentEmbeddedFile={setCurrentEmbeddedFile}
          setCurrentComponent={setCurrentComponent}
          handleReplaceCode={handleReplaceCode}
          handleInsertAboveCode={handleInsertAboveCode}
          handleInsertBelowCode={handleInsertBelowCode}
          handleInsertLeftCode={handleInsertLeftCode}
          handleInsertRightCode={handleInsertRightCode}
          scrollContainerRef={scrollContainerRef}
        />
      )}
    </div>
  );
};

export default MessageContent;


