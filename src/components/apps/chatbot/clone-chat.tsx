import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { ChatInterface } from '@/types/chat';
import TickIcon from '@/icons/TickIcon';
import CloneIcon from '@/icons/CloneIcon';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useMyspaceContext } from "@/context/myspace-context-provider";

const CloneChat: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const setChats = usePortalStore((state) => state.setChats);
  const setCurrentChatIndex = usePortalStore((state) => state.setCurrentChatIndex);
  const { activeDocument, activeOrg } = useMyspaceContext();
  const createChat = useMutation(api.chats.createChat);
  const [cloned, setCloned] = useState<boolean>(false);
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleCreateCloudChat = useCallback(async (chat: ChatInterface) => {
    try {
      return await createChat({ chat: chat });
    } catch (error) {
      console.error('Error creating cloud chat:', error);
      throw error;
    }
  }, [createChat]);

  const getUniqueTitle = useCallback((baseTitle: string): string => {
    const chats = usePortalStore.getState().chats;
    let title = `Copy of ${baseTitle}`;
    let i = 0;
    while (chats.some((chat) => chat.chatTitle === title)) {
      i += 1;
      title = `Copy ${i} of ${baseTitle}`;
    }
    return title;
  }, []);

  const cloneChat = useCallback(async () => {
    const chats = usePortalStore.getState().chats;
    const currentChatIndex = usePortalStore.getState().currentChatIndex;
    if (!chats || currentChatIndex === undefined || currentChatIndex < 0 || currentChatIndex >= chats.length) {
      toast.error('No chats available or invalid current chat index');
      return;
    }
    if (!currentUser) {
      toast.error("User is not authenticated");
      return;
    }
    const sourceChat = chats[currentChatIndex];
    const clonedChat: ChatInterface = {
      ...JSON.parse(JSON.stringify(sourceChat)),
      chatTitle: getUniqueTitle(sourceChat.chatTitle),
      userId: currentUser.userId,
      metaData: {
        documents: activeDocument ? [activeDocument] : [],
        orgs: activeOrg ? [{
          orgId: activeOrg.orgId,
          roles: [],
          users: [],
          permissions: {
            create: true, get: true, view: true, update: true,
            delete: true, archive: true, restore: true, aiAccess: true
          }
        }] : [],
      }
    };

    try {
      const newChatId = await handleCreateCloudChat(clonedChat);
      if (newChatId) {
        clonedChat.cloudChatId = newChatId;
        setChats([clonedChat, ...chats]);
        setCurrentChatIndex(0);
        setCloned(true);
        toast.success("Chat cloned successfully");
        setTimeout(() => setCloned(false), 3000);
      }
    } catch (error) {
      console.error('Failed to create cloud chat:', error);
      toast.error("Failed to clone chat");
    }
  }, [currentUser, activeDocument, activeOrg, handleCreateCloudChat, getUniqueTitle, setChats, setCurrentChatIndex]);

  return (
    <button
      className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out bg-black text-white hover:bg-black/50`}
      aria-label={t('cloneChat')}
      onClick={cloneChat}
      disabled={cloned}
    >
      <span className="flex items-center justify-center">
        {cloned ? (
          <>
            <TickIcon className="w-5 h-5 mr-2" />
            {t('cloned')}
          </>
        ) : (
          <>
            <CloneIcon className="w-5 h-5 mr-2" />
            {t('cloneChat')}
          </>
        )}
      </span>
      {cloned && (
        <span className="absolute inset-0 flex items-center justify-center bg-green-500 text-white rounded-md opacity-0 transition-opacity duration-500 ease-in-out animate-fade-in">
          <TickIcon className="w-5 h-5 mr-2" />
          {t('cloned')}
        </span>
      )}
    </button>
  );
});

CloneChat.displayName = 'CloneChat';

export default CloneChat;