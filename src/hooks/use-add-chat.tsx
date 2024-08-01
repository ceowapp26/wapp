import { useStore } from '@/redux/features/apps/document/store';
import { generateDefaultChat } from '@/constants/chat';
import { ChatInterface } from '@/types/chat';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { toast } from 'sonner';

export const useAddChat = () => {
  const { setChats, setCurrentChatIndex } = useStore();
  const { activeOrg, activeDocument } = useMyspaceContext();
  const createChat = useMutation(api.chats.createChat);
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleCreateCloudChat = async (chat: ChatInterface) => {
    try {
      const result = await createChat({ chat: chat });
      return result;
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

  return async (folderId?: string) => {
    if (!currentUser) {
      toast.error('Failed to authenticate.');
      throw new Error('Current user is not set');
    }

    try {
      const { chats, archivedChats } = useStore.getState();
      const allChats = [...Object.values(chats), ...Object.values(archivedChats).map(chat => chat.chat)];
      const title = getUniqueTitle(allChats);
      const newChat: ChatInterface = {
        ...generateDefaultChat(title, folderId),
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
        const updatedChats = [newChat, ...chats];
        setChats(updatedChats);
        setCurrentChatIndex(0);
      } else {
        throw new Error("Failed to create initial chat");
      }
    } catch (error) {
      toast.error(`Failed to create chat: ${error.message}`);
    }
  };
};