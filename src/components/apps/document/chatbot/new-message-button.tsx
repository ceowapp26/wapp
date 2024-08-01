import React from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import PlusIcon from '@/icons/PlusIcon';
import { ChatInterface } from '@/types/chat';
import { generateDefaultChat } from '@/constants/chat';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { toast } from "sonner";

const NewMessageButton = React.memo(
  ({ messageIndex }: { messageIndex: number }) => {
    const setChats = useStore((state) => state.setChats);
    const currentChatIndex = useStore((state) => state.currentChatIndex);
    const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
    const createChat = useMutation(api.chats.createChat);
    const updateChat = useMutation(api.chats.updateChat);
    const { activeOrg, activeDocument } = useMyspaceContext();
    const currentUser = useQuery(api.users.getCurrentUser);

    const handleCreateCloudChat = async( chat: ChatInterface ) => {
      try {
        const result = await createChat({ chat: chat });
        return result;
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex: number, chat: ChatInterface) => {
      try {
        await updateChat({ id: id, chatIndex: chatIndex, chat: chat });
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const getUniqueTitle = (existingChats: ChatInterface[]): string => {
      let titleIndex = 1;
      let title: string;
      do {
        title = `New Chat ${titleIndex++}`;
      } while (existingChats.some(chat => chat.chatTitle === title));
      return title;
    };

    const addChat = async () => {
      if (!currentUser) {
        toast.error('Failed to authenticate.');
        throw new Error('Current user is not set');
      }
      const { chats, archivedChats } = useStore.getState();
      const allChats = [...Object.values(chats), ...Object.values(archivedChats).map(chat => chat.chat)];
      if (chats) {
        const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(chats));
        const title = getUniqueTitle(allChats);
        const newChat: ChatInterface = {
          ...generateDefaultChat(title),
          userId: currentUser._id,
          metaData: {
            documents: activeDocument ? [activeDocument] : [],
            orgs: activeOrg ? [{
              orgId: activeOrg.orgId,
              roles: [],
              users: [],
              permissions: {
                create: true, get: true, view: true, update: true,
                delete: true, archive: true, restore: true, aiAccess: true,
              },
            }] : [],
          },
        };  
        const newChatId = await handleCreateCloudChat(newChat);
        if (newChatId) {
          newChat.cloudChatId = newChatId;
          updatedChats.unshift(newChat);
          setChats(updatedChats);
          setCurrentChatIndex(0);
        } else {
          return;
        }
      }
    };

    const addMessage = () => {
      if (currentChatIndex === -1) {
        addChat();
      } else {
        const updatedChats: ChatInterface[] = JSON.parse(
          JSON.stringify(useStore.getState().chats)
        );
        updatedChats[currentChatIndex].messages.splice(messageIndex + 1, 0, {
          content: '',
          role: 'user',
        });
        setChats(updatedChats);
        const chatId = updatedChats[currentChatIndex].chatId;
        const newChatIndex = updatedChats.findIndex((chat) => chat.chatId === chatId);
        handleUpdateCloudChat(updatedChats[currentChatIndex].cloudChatId, newChatIndex, updatedChats[currentChatIndex]);
      }
    };

    return (
      <div
        className='h-0 w-0 relative'
        key={messageIndex}
        aria-label='insert message'
      >
        <div
          className='absolute top-0 right-0 translate-x-1/2 translate-y-[-50%] text-gray-600 dark:text-white cursor-pointer bg-gray-200 dark:bg-gray-600/80 rounded-full p-1 text-sm hover:bg-gray-300 dark:hover:bg-gray-800/80 transition-bg duration-200'
          onClick={addMessage}
        >
          <PlusIcon />
        </div>
      </div>
    );
  }
);

export default NewMessageButton;