import React, { useMemo } from 'react';
import MessageContent from './message-content';
import { Role } from '@/types/chat';
import RoleSelector from './role-selector';
import ContextSelector from './context-selector';
import ModelSelector from "./model-selector";
import { useStore } from '@/redux/features/apps/document/store';
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
    command, 
    context, 
    model,
    messageIndex,
    sticky = false,
  }: {
    role: Role;
    content: string;
    command: string, 
    context: string, 
    model: string;
    messageIndex: number;
    sticky?: boolean;
  }) => {
    const hideSideMenu = useStore((state) => state.hideSideMenu);
    const advancedMode = useStore((state) => state.advancedMode);
    const { rightSidebarWidth } = useMyspaceContext();
    const SMALL_SCREEN_THRESHOLD = 375;
    const MEDIUM_SCREEN_THRESHOLD = 500;
    const isSmallScreen = useMemo(() => rightSidebarWidth > SMALL_SCREEN_THRESHOLD, [rightSidebarWidth]); 
    const isMediumScreen = useMemo(() => rightSidebarWidth > MEDIUM_SCREEN_THRESHOLD, [rightSidebarWidth]); 
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
            <div className={`flex justify-end gap-x-2 ${isSmallScreen ? 'sm:justify-between' : ''}`}>
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
                  context={context}
                  messageIndex={messageIndex}
                  sticky={sticky}
                />
              }
            </div>
            <MessageContent
              role={role}
              content={content}
              command={command}
              context={context}
              model={model}
              messageIndex={messageIndex}
              sticky={sticky}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Message;

