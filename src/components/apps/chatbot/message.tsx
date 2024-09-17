import React, { useEffect, useState } from 'react';
import MessageContent from './message-content';
import { Role, FileInterface } from '@/types/chat';
import RoleSelector from './role-selector';
import ContextSelector from './context-selector';
import ModelSelector from "./model-selector";
import { usePortalStore } from '@/stores/features/apps/portal/store';
import ChatAvatar from './chat-avatar';
import CommandBadge from './command-badge';
import { useMyspaceContext } from "@/context/myspace-context-provider";
// const backgroundStyle: { [role in Role]: string } = {
//   user: 'dark:bg-gray-800',
//   assistant: 'bg-gray-50 dark:bg-gray-650',
//   system: 'bg-gray-50 dark:bg-gray-650',
// };
const backgroundStyle = ['dark:bg-gray-800', 'bg-gray-50 dark:bg-gray-600'];

const Message = React.memo(
  ({
    role,
    content,
    embeddedContent,
    command, 
    context, 
    model,
    messageIndex,
    sticky = false,
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
    role: Role;
    content: string;
    embeddedContent: FileInterface[];
    command: string; 
    context: string;
    model: string;
    messageIndex: number;
    sticky?: boolean;
    currentCodeFile?: CodeFile;
    setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
    currentEmbeddedFile?: FileInterface,
    setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
    setCurrentComponent?: Dispatch<SetStateAction<string>>;
    isCode?: boolean;
    handleReplaceCode?: (content: string) => void;
    handleInsertAboveCode?: (content: string) => void;
    handleInsertBelowCode?: (content: string) => void;
    handleInsertLeftCode?: (content: string) => void;
    handleInsertRightCode?: (content: string) => void;
    scrollContainerRef?: React.RefObject<HTMLDivElement>;
  }) => {
    const hideSideMenu = usePortalStore((state) => state.hideSideMenu);
    const advancedMode = usePortalStore((state) => state.advancedMode);
    const { rightSidebarWidth } = useMyspaceContext();
    const SMALL_SCREEN_THRESHOLD = 375;
    const MEDIUM_SCREEN_THRESHOLD = 500;
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isMediumScreen, setIsMediumScreen] = useState(false);
    const scrollContainerWidth = scrollContainerRef?.current?.clientWidth;

    useEffect(() => {
      if (!isCode) {
        setIsSmallScreen(rightSidebarWidth < SMALL_SCREEN_THRESHOLD);
        setIsMediumScreen(rightSidebarWidth > MEDIUM_SCREEN_THRESHOLD);
      } else if (isCode && scrollContainerWidth) {
        setIsSmallScreen(scrollContainerWidth < SMALL_SCREEN_THRESHOLD); 
        setIsMediumScreen(scrollContainerWidth > MEDIUM_SCREEN_THRESHOLD); 
      }
    }, [rightSidebarWidth, scrollContainerWidth, isCode]);

    return (
      <div
        className={`w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group ${
          backgroundStyle[messageIndex % 2]
        }`}
      >
        <div
          className={`text-base gap-4 md:gap-6 m-auto p-6 md:py-6 flex transition-all ease-in-out ${
            hideSideMenu
              ? 'md:max-w-5xl lg:max-w-5xl xl:max-w-6xl'
              : 'md:max-w-3xl lg:max-w-3xl xl:max-w-4xl'
          }`}
        >
          <ChatAvatar role={role} />
          <div className='w-[calc(100%-50px)]'>
            <div className={`flex justify-end gap-x-2 ${isMediumScreen ? 'justify-between' : ''}`}>
              {advancedMode && isSmallScreen &&
                <RoleSelector
                  role={role}
                  messageIndex={messageIndex}
                  sticky={sticky}
                />
              }
              {command &&     
                <CommandBadge command={command} />
              }
              <ModelSelector
                model={model}
                messageIndex={messageIndex}
                sticky={sticky}
              />
              {isMediumScreen &&
                <ContextSelector
                  isCode={isCode}
                  context={context}
                  messageIndex={messageIndex}
                  sticky={sticky}
                />
              }
            </div>
            <MessageContent
              role={role}
              content={content}
              embeddedContent={embeddedContent}
              command={command}
              context={context}
              model={model}
              messageIndex={messageIndex}
              sticky={sticky}
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
          </div>
        </div>
      </div>
    );
  }
);

export default Message;


