import React from 'react';
import { Role } from '@/types/chat';
import SettingIcon from '@/icons/SettingIcon';
import PersonIcon from '@/icons/PersonIcon';
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ChatAvatar = React.memo(({ role }: { role: Role }) => {
  const avatarComponents = {
    user: <UserAvatar />,
    assistant: <AssistantAvatar />,
    system: <SystemAvatar />,
  };

  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-md transition-transform duration-300 hover:scale-110">
      {avatarComponents[role]}
    </div>
  );
});

const UserAvatar = () => {
  const { user } = useUser();
  return (
    <Avatar className="w-full h-full">
      <AvatarImage src={user?.imageUrl} alt="User avatar" />
      <AvatarFallback>
        <PersonIcon className="w-6 h-6 text-gray-400" />
      </AvatarFallback>
    </Avatar>
  );
};

const AssistantAvatar = () => (
  <Avatar className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-600">
    <AvatarImage src="/global/images/ai/chat.png" alt="Assistant avatar" />
    <AvatarFallback>AI</AvatarFallback>
  </Avatar>
);

const SystemAvatar = () => (
  <Avatar className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500">
    <AvatarImage src="/global/images/ai/brain.png" alt="System avatar" />
    <AvatarFallback>
      <SettingIcon className="w-6 h-6 text-white" />
    </AvatarFallback>
  </Avatar>
);

export default ChatAvatar;