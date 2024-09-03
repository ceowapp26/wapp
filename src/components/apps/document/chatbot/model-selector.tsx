import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { useModelStore } from '@/stores/features/models/store';
import { ChatInterface, Model } from '@/types/chat';
import { useHideOnOutsideClick } from '@/hooks/use-hideon-outside-click';
import { useMutation } from "convex/react";
import { Select } from "@/components/ui/nextui-select";
import { ModelOption } from "@/types/ai";
import { AIModelOptions, _defaultModel } from "@/constants/ai";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useGeneralContext } from "@/context/general-context-provider";

const ModelSelector = React.memo(
  ({
    model,
    messageIndex,
    sticky,
  }: {
    model: Model;
    messageIndex: number;
    sticky?: boolean;
  }) => {
    const { t } = useTranslation();
    const setChatModel = useDocumentStore((state) => state.setChatModel);
    const setChats = useDocumentStore((state) => state.setChats);
    const currentChatIndex = useDocumentStore((state) => state.currentChatIndex);
    const AIConfig = useModelStore((state) => state.AIConfig);
    const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();
    const updateChat = useMutation(api.chats.updateChat);

    const handleAsyncConfig = async (selectedModelKey: ModelOption) => {
      if (!selectedModelKey) return;
      const updatedChats = JSON.parse(JSON.stringify(useDocumentStore.getState().chats));
      const currentChat = updatedChats[currentChatIndex];
      if (currentChat && currentChat.messages[messageIndex]) {
        currentChat.messages[messageIndex].model = selectedModelKey;
        setChats(updatedChats);
        await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
      }
    }
      
    const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex: number, chat: ChatInterface) => {
      try {
        await updateChat({ id: id, chatIndex: chatIndex, chat: chat });
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
 
    return (
      <div ref={dropDownRef}>
        <Select 
          options={AIModelOptions} 
          label="Model"
          defaultOption={model}
          selectedOption={model} 
          setSelectedOption={setChatModel} 
          handleAsyncConfig={handleAsyncConfig} 
        />
      </div>
    );
  }
);

export default ModelSelector;


 