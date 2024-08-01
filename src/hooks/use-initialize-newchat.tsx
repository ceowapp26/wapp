import { useCallback } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import { ChatInterface } from '@/types/chat';
import { generateDefaultChat } from '@/constants/chat';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useMyspaceContext } from "@/context/myspace-context-provider";

export const useInitializeNewChat = () => {
  const { setChats, setCurrentChatIndex } = useStore();
  const { activeDocument, activeOrg } = useMyspaceContext();
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

  return useCallback(async () => {
    if (!currentUser) {
      toast.error("Failed to authenticate.");
      throw new Error("Current user is not set");
    }

    try {
      const initialData: ChatInterface = {
        ...generateDefaultChat(),
        userId: currentUser._id,
        metaData: {
          documents: activeDocument ? [activeDocument] : [],
          orgs: activeOrg ? [{
            orgId: activeOrg.orgId,
            roles: [],
            users: [],
            permissions: {
              create: true,
              get: true,
              view: true,
              update: true,
              delete: true,
              archive: true,
              restore: true,
              aiAccess: true,
            },
          }] : [],
        },
      };
      const newChatId = await handleCreateCloudChat(initialData);
      if (newChatId) {
        initialData.cloudChatId = newChatId;
        setChats([initialData]);
        setCurrentChatIndex(0);
      } else {
        throw new Error("Failed to create initial chat");
      }
    } catch (error) {
      toast.error(`Failed to initialize chat: ${error.message}`);
    }
  }, [activeDocument, activeOrg, currentUser, setChats, setCurrentChatIndex, createChat]);
};