import React, { useEffect, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { ScrollButton }  from '@/components/scroll-button';
import ChatTitle from './chat-title';
import Message from './message';
import NewMessage from './new-message';
import NewMessageButton from './new-message-button';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { ChevronDown, Plus } from 'lucide-react';
import { useSubmit } from "@/hooks/use-submit";
import { useGeneralContext } from '@/context/general-context-provider';
import DownloadChat from './download-chat';
import CloneChat from './clone-chat';
import ShareChat from './share-chat';
import ErrorContainer from './error-container';
import Warning from '@/components/models/warning'; 

const ChatContent = () => {
  const chatRole = useDocumentStore((state) => state.chatRole);
  const chatContext = useDocumentStore((state) => state.chatContext);
  const chatModel = useDocumentStore((state) => state.chatModel);
  const setError = useDocumentStore((state) => state.setError);
  const messages = useDocumentStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages
      : []
  );
  const stickyIndex = useDocumentStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages.length
      : 0
  );
  const advancedMode = useDocumentStore((state) => state.advancedMode);
  const generating = useDocumentStore.getState().generating;
  const hideSideMenu = useDocumentStore((state) => state.hideSideMenu);
  const { showWarning, warningType, nextTimeUsage } = useGeneralContext();
  const saveRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { error } = useSubmit();

  useEffect(() => {
    if (generating) {
      setError(null);
    }
  }, [generating]);

  return (
    <div className='flex-1 overflow-hidden'>
      <ScrollToBottom className='h-full dark:bg-gray-800' followButtonClassName='hidden'>
        <div ref={scrollContainerRef} className='flex flex-col items-center text-sm dark:bg-gray-800'>
          <ScrollButton theme="light" scrollContainerRef={scrollContainerRef} />
          <div className='flex flex-col items-center text-sm dark:bg-gray-800 w-full' ref={saveRef}>
            {advancedMode && <ChatTitle />}
            {!generating && advancedMode && messages?.length === 0 && (
              <NewMessageButton messageIndex={-1} />
            )}
            {messages?.map((message, index) => (
              <React.Fragment key={index}>
                <Message
                  role={message.role}
                  content={message.content}
                  command={message.command}
                  context={message.context}
                  model={message.model}
                  messageIndex={index}
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
            messageIndex={stickyIndex}
            sticky
          />
          {error && <ErrorContainer error={error} setError={setError} />}
          <div
            className={`mt-4 w-full m-auto flex justify-center ${
              hideSideMenu
                ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl'
                : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'
            }`}
          >
            {useDocumentStore.getState().generating || (
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
