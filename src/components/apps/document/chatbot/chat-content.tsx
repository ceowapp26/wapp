import React, { useEffect, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { ScrollToBottomButton }  from '@/components/scroll-to-bottom-button';
import ChatTitle from './chat-title';
import Message from './message';
import NewMessageButton from './new-message-button';
import { useStore } from '@/redux/features/apps/document/store';
import { ChevronDown, Plus } from 'lucide-react';
import { useSubmit } from '@/hooks/use-submit';
import { useGeneralContext } from '@/context/general-context-provider';
import DownloadChat from './download-chat';
import CloneChat from './clone-chat';
import ShareChat from './share-chat';
import ErrorContainer from './error-container';
import Warning from '@/components/models/warning'; 

const ChatContent = () => {
  const inputRole = useStore((state) => state.inputRole);
  const inputContext = useStore((state) => state.inputContext);
  const inputModel = useStore((state) => state.inputModel);
  const setError = useStore((state) => state.setError);
  const messages = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages
      : []
  );
  const stickyIndex = useStore((state) =>
    state.chats &&
    state.chats.length > 0 &&
    state.currentChatIndex >= 0 &&
    state.currentChatIndex < state.chats.length
      ? state.chats[state.currentChatIndex].messages.length
      : 0
  );
  const advancedMode = useStore((state) => state.advancedMode);
  const generating = useStore.getState().generating;
  const hideSideMenu = useStore((state) => state.hideSideMenu);
  const { showWarning, warningType, nextTimeUsage } = useGeneralContext();
  const saveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (generating) {
      setError('');
    }
  }, [generating]);

  const { error } = useSubmit();

  return (
    <div className='flex-1 overflow-hidden'>
      <ScrollToBottom className='h-full dark:bg-gray-800' followButtonClassName='hidden'>
        <ScrollToBottomButton variant="chat" />
        <div className='flex flex-col items-center text-sm dark:bg-gray-800'>
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
          <Message
            role={inputRole}
            content=''
            command=''
            context={inputContext}
            model={inputModel}
            messageIndex={stickyIndex}
            sticky
          />
          {/*<ErrorContainer error={"This is the test message for the error container"} setError={setError} /> */}
          <div
            className={`mt-4 w-full m-auto flex justify-center ${
              hideSideMenu
                ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl'
                : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'
            }`}
          >
            {useStore.getState().generating || (
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
          type={waringType}
          nextTimeUsage={nextTimeUsage}
        />
      )}
    </div>
  );
};

export default ChatContent;
