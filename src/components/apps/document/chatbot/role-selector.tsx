import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/redux/features/apps/document/store';
import { ChatInterface, Role, roles } from '@/types/chat';
import { useHideOnOutsideClick } from '@/hooks/use-hideon-outside-click';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Bot, Edit } from 'lucide-react';

const RoleSelector: React.FC<{
  role: Role;
  messageIndex: number;
  sticky?: boolean;
}> = React.memo(({ role, messageIndex, sticky }) => {
  const { t } = useTranslation();
  const setInputRole = useStore((state) => state.setInputRole);
  const setChats = useStore((state) => state.setChats);
  const updateChat = useMutation(api.chats.updateChat);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

  const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex: number, chat: ChatInterface) => {
    try {
      await updateChat({ id, chatIndex, chat });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getRoleIcon = (r: Role) => {
    switch (r) {
      case 'user':
        return <User size={18} />;
      case 'assistant':
        return <Bot size={18} />;
      default:
        return <Edit size={18} />;
    }
  };

  return (
    <div className='relative inline-block text-left mt-1'>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
        onClick={() => setDropDown((prev) => !prev)}
      >
        <span className="flex items-center gap-2">
          {getRoleIcon(role)}
          {t(role)}
          <ChevronDown size={16} className={`transition-transform duration-200 ${dropDown ? 'rotate-180' : ''}`} />
        </span>
      </motion.button>

      <AnimatePresence>
        {dropDown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            ref={dropDownRef}
            className="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800"
          >
            <div className="py-1">
              {roles.map((r) => (
                <motion.button
                  key={r}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  whileTap={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                  className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                  onClick={() => {
                    if (!sticky) {
                      const updatedChats: ChatInterface[] = JSON.parse(
                        JSON.stringify(useStore.getState().chats)
                      );
                      const currentChat = updatedChats[currentChatIndex];
                      currentChat.messages[messageIndex].role = r;
                      setChats(updatedChats);
                      handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
                    } else {
                      setInputRole(r);
                    }
                    setDropDown(false);
                  }}
                >
                  <span className="mr-2">{getRoleIcon(r)}</span>
                  {t(r)}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

RoleSelector.displayName = 'RoleSelector';

export default RoleSelector;