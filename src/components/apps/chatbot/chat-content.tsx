import React, { useEffect, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { ScrollButton }  from '@/components/scroll-button';
import { FileInterface } from "@/types/chat";
import ChatTitle from './chat-title';
import Message from './message';
import NewMessage from './new-message';
import NewMessageButton from './new-message-button';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { useSubmit } from "@/hooks/use-submit";
import { useGeneralContext } from '@/context/general-context-provider';
import DownloadChat from './download-chat';
import CloneChat from './clone-chat';
import ShareChat from './share-chat';
import ErrorContainer from './error-container';
import Warning from '@/components/models/warning'; 

interface CodeFile {
  [key: string]: string;
}

interface ChatContentProps {
  isInsertedContent?: boolean;
  insertedContent?: string;
  currentCodeFile?: CodeFile;
  setInsertedContent?: React.Dispatch<React.SetStateAction<string>>;
  setIsInsertedContent?: React.Dispatch<React.SetStateAction<boolean>>;
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
}

const ChatContent = ({ isCode, isInsertedContent, insertedContent, setInsertedContent, setIsInsertedContent, currentCodeFile, currentEmbeddedFile, setCurrentCodeFile, setCurrentEmbeddedFile, setCurrentComponent, handleReplaceCode, handleInsertAboveCode, handleInsertBelowCode, handleInsertRightCode, handleInsertLeftCode }: ChatContentProps) => {
  const {
    chatRole,
    chatContext,
    chatModel,
    setError,
    messages,
    stickyIndex,
    advancedMode,
    generating,
    hideSideMenu,
    chats,
    currentChatIndex,
  } = usePortalStore();

  const { showWarning, warningType, nextTimeUsage } = useGeneralContext();
  const saveRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { error } = useSubmit();

  useEffect(() => {
    if (generating) {
      setError(null);
    }
  }, [generating, setError]);

  const currentMessages = chats && chats.length > 0 && currentChatIndex >= 0 && currentChatIndex < chats.length
    ? chats[currentChatIndex].messages
    : [];

  const currentStickyIndex = chats && chats.length > 0 && currentChatIndex >= 0 && currentChatIndex < chats.length
    ? chats[currentChatIndex].messages.length
    : 0;

  return (
    <div className='flex-1 overflow-hidden'>
      <ScrollToBottom className='h-full dark:bg-gray-800' followButtonClassName='hidden'>
        <div ref={scrollContainerRef} className='flex flex-col items-center text-sm dark:bg-gray-800'>
          <ScrollButton theme="light" isCode={isCode} scrollContainerRef={scrollContainerRef} />
          <div className='flex flex-col items-center text-sm dark:bg-gray-800 w-full' ref={saveRef}>
            {advancedMode && <ChatTitle />}
            {!generating && advancedMode && currentMessages.length === 0 && (
              <NewMessageButton messageIndex={-1} />
            )}
            {currentMessages.map((message, index) => (
              <React.Fragment key={index}>
                <Message
                  role={message.role}
                  content={message.content}
                  embeddedContent={message.embeddedContent}
                  command={message.command}
                  context={message.context}
                  model={message.model}
                  messageIndex={index}
                  isCode={isCode}
                  currentCodeFile={currentCodeFile}
                  setCurrentCodeFile={setCurrentCodeFile}
                  currentEmbeddedFile={currentEmbeddedFile}
                  setCurrentEmbeddedFile={setCurrentEmbeddedFile}
                  setCurrentComponent={setCurrentComponent}
                  scrollContainerRef={scrollContainerRef}
                  handleReplaceCode={handleReplaceCode}
                  handleInsertAboveCode={handleInsertAboveCode}
                  handleInsertBelowCode={handleInsertBelowCode}
                  handleInsertLeftCode={handleInsertLeftCode}
                  handleInsertRightCode={handleInsertRightCode}
                />
                {!generating && advancedMode && <NewMessageButton messageIndex={index} />}
              </React.Fragment>
            ))}
          </div>
          <NewMessage
            role={chatRole}
            content=''
            command=''
            context={chatContext}
            model={chatModel}
            messageIndex={currentStickyIndex}
            sticky
            isCode={isCode}
            insertedContent={insertedContent}
            isInsertedContent={isInsertedContent}
            setIsInsertedContent={setIsInsertedContent}
            setInsertedContent={setInsertedContent}
            currentCodeFile={currentCodeFile}
            setCurrentCodeFile={setCurrentCodeFile}
            currentEmbeddedFile={currentEmbeddedFile}
            setCurrentEmbeddedFile={setCurrentEmbeddedFile}
            setCurrentComponent={setCurrentComponent}
            scrollContainerRef={scrollContainerRef}
          />
          {error && <ErrorContainer error={error} setError={setError} />}
          <div
            className={`mt-4 w-full m-auto flex justify-center ${
              hideSideMenu
                ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl'
                : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'
            }`}
          >
            {!generating && (
              <div className='md:w-[calc(100%-50px)] flex gap-4 flex-wrap justify-center'>
                <DownloadChat saveRef={saveRef} />
                <ShareChat />
                <CloneChat />
              </div>
            )}
          </div>
          <div className='w-full h-16'></div>
        </div>
      </ScrollToBottom>
      {showWarning && (
        <Warning
          type={warningType}
          nextTimeUsage={nextTimeUsage}
          inputModel={chatModel}
        />
      )}
    </div>
  );
};

export default ChatContent;