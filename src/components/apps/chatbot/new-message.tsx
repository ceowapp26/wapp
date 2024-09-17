import React, { useEffect, useState } from 'react';
import MessageContent from './message-content';
import { Role, FileInterface } from '@/types/chat';
import RoleSelector from './role-selector';
import ContextSelector from './context-selector';
import ModelSelector from "./model-selector";
import ExpertSelector from "./expert-selector";
import { usePortalStore } from '@/stores/features/apps/portal/store';
import ChatAvatar from './chat-avatar';
import CommandBadge from './command-badge';
import { useMyspaceContext } from "@/context/myspace-context-provider";

const backgroundStyle = ['dark:bg-gray-800', 'bg-gray-50 dark:bg-gray-600'];

const NewMessage = React.memo(
  ({
    role,
    content,
    command, 
    context, 
    model,
    expert,
    messageIndex,
    sticky = false,
    currentCodeFile,
    isInsertedContent,
    insertedContent,
    setIsInsertedContent,
    setInsertedContent,
    setCurrentCodeFile,
    currentEmbeddedFile,
    setCurrentEmbeddedFile,
    setCurrentComponent,
    isCode,
    scrollContainerRef,
  }: {
    role: Role;
    content: string;
    command: string, 
    context: string, 
    model: string;
    expert: { name: string; avatar: string; specialty: string } | null;
    messageIndex: number;
    sticky?: boolean;
    isInsertedContent?: boolean;
    insertedContent?: string;
    currentCodeFile?: CodeFile;
    setInsertedContent?: React.Dispatch<React.SetStateAction<string>>;
    setIsInsertedContent?: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
    currentEmbeddedFile?: FileInterface,
    setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
    setCurrentComponent?: Dispatch<SetStateAction<string>>;
    isCode?: boolean;
    scrollContainerRef?: React.RefObject<HTMLDivElement>;
  }) => {
    const hideSideMenu = usePortalStore((state) => state.hideSideMenu);
    const advancedMode = usePortalStore((state) => state.advancedMode);
    const { rightSidebarWidth } = useMyspaceContext();
    const SMALL_SCREEN_THRESHOLD = 375;
    const MEDIUM_SCREEN_THRESHOLD = 500;
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isMediumScreen, setIsMediumScreen] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState(expert);
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
              {isMediumScreen && (
                <>
                  <ContextSelector
                    isCode={isCode}
                    context={context}
                    messageIndex={messageIndex}
                    sticky={sticky}
                  />
                  <ExpertSelector
                    expert={selectedExpert}
                    setExpert={setSelectedExpert}
                    messageIndex={messageIndex}
                    sticky={sticky}
                  />
                </>
              )}
            </div>
            <MessageContent
              role={role}
              content={content}
              command={command}
              context={context}
              model={model}
              expert={selectedExpert}
              messageIndex={messageIndex}
              sticky={sticky}
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
          </div>
        </div>
      </div>
    );
  }
);

export default NewMessage;

