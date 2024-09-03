import React from 'react';
import { Role } from '@/types/chat';
import SettingIcon from '@/icons/SettingIcon';
import PersonIcon from '@/icons/PersonIcon';
import { useUser, SignOutButton } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const ChatAvatar = React.memo(({ role }: { role: Role }) => {
  return (
    <div className='w-[30px] flex flex-col relative items-end'>
      {role === 'user' && <UserAvatar />}
      {role === 'assistant' && <AssistantAvatar />}
      {role === 'system' && <SystemAvatar />}
    </div>
  );
});


const UserAvatar = () => {
  const { user } = useUser();
  return (
    <div
      className='relative p-1 rounded-sm text-white flex items-center justify-center hover:bg-primary/5'
    >
      <Avatar className="h-[30px] w-[30px]">
        <AvatarImage src={user?.imageUrl} />
      </Avatar>
    </div>
  );
};

const AssistantAvatar = () => {
  return (
    <div className='relative h-[30px] w-[30px] p-1 bg-transparent rounded-sm text-white flex items-center justify-center'>
      <Avatar className="h-[30px] w-[30px]">
        <AvatarImage src={"/global/images/ai/chat.png"} />
      </Avatar>
    </div>
  );
};

const SystemAvatar = () => {
  return (
    <div className='relative h-[30px] w-[30px] p-1 bg-transparent rounded-sm text-white flex items-center justify-center'>
      <Avatar className="h-[30px] w-[30px]">
        <AvatarImage src={"/global/images/ai/brain.png"} />
      </Avatar>    
    </div>
  );
};

export default ChatAvatar;