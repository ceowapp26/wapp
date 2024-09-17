import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { ChatInterface, Context } from '@/types/chat';
import { useHideOnOutsideClick } from '@/hooks/use-hideon-outside-click';
import { useMutation } from "convex/react";
import { Select } from "@/components/ui/nextui-select";
import { generateAIContextOptions } from "@/constants/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const ContextSelector = React.memo(
  ({
    context,
    messageIndex,
    sticky,
    isCode,
  }: {
    context: Context;
    messageIndex: number;
    sticky?: boolean;
    isCode?: boolean;
  }) => {
    const { t } = useTranslation();
    const AIContextOptions = generateAIContextOptions(isCode);
    const setChatContext = usePortalStore((state) => state.setChatContext);
    const setChats = usePortalStore((state) => state.setChats);
    const currentChatIndex = usePortalStore((state) => state.currentChatIndex);
    const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();
    const updateChat = useMutation(api.chats.updateChat);

    const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex: number, chat: ChatInterface) => {
      try {
        await updateChat({ id: id, chatIndex: chatIndex, chat: chat });
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const handleAsyncConfig = async (selectedContextKey: Context) => {
      if (!selectedContextKey) return;
      const updatedChats = JSON.parse(JSON.stringify(usePortalStore.getState().chats));
      const currentChat = updatedChats[currentChatIndex];
      if (currentChat && currentChat.messages[messageIndex]) {
        currentChat.messages[messageIndex].context = selectedContextKey;
        setChats(updatedChats);
        await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
      }
    };

    return (
      <div ref={dropDownRef}>
        <Select 
          options={AIContextOptions} 
          label="Context"
          selectedOption={context}
          defaultOption={context}
          setSelectedOption={setChatContext} 
          handleAsyncConfig={handleAsyncConfig} 
        />
      </div>
    );
  }
);

export default ContextSelector;



