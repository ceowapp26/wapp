import React, { useState } from 'react';
import ContentView from './content-view';
import ChatView from './chat-view';

const MessageContent = ({
  role,
  content,
  command, 
  context, 
  model,
  messageIndex,
  sticky = false,
}: {
  role: string;
  content: string;
  command: string;
  context: string;
  model: string;
  messageIndex: number;
  sticky?: boolean;
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
        />
      ) : (
        <ContentView
          role={role}
          content={content}
          command={command}
          context={context}
          model={model}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
        />
      )}
    </div>
  );
};

export default MessageContent;


