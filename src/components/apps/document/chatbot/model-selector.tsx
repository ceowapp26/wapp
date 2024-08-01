import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/redux/features/apps/document/store';
import { ChatInterface, Model } from '@/types/chat';
import { useHideOnOutsideClick } from '@/hooks/use-hideon-outside-click';
import { useMutation } from "convex/react";
import { Select } from "@/components/ui/nextui-select";
import { AIModelOptions, APIEndpointOptions } from "@/constants/ai";
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
    const inputModel = useStore((state) => state.inputModel);
    const setInputModel = useStore((state) => state.setInputModel);
    const AIConfig = useStore((state) => state.AIConfig);
    const setChats = useStore((state) => state.setChats);
    const currentChatIndex = useStore((state) => state.currentChatIndex);
    const setApiEndpoint = useStore((state) => state.setApiEndpoint);
    const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();
    const updateChat = useMutation(api.chats.updateChat);
    const { setAiModel } = useGeneralContext();

    const handleAsyncStore = async () => {
      if (!sticky) {
        const selectedModelKey = Array.from(inputModel)[0];
        setInputModel(selectedModelKey);
        const updatedChats: ChatInterface[] = JSON.parse(
          JSON.stringify(useStore.getState().chats)
        );
        const currentChat = updatedChats[currentChatIndex];
        switch (true) {
          case selectedModelKey.includes("gpt"):
            setApiEndpoint(APIEndpointOptions.find(option => option.key === "openAI")?.value || "");
            break;
          case selectedModelKey.includes("gemini"):
            setApiEndpoint(APIEndpointOptions.find(option => option.key === "gemini")?.value || "");
            break;
          default:
            break;
        }
        currentChat.messages[messageIndex].model = selectedModelKey;
        setChats(updatedChats);
        await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
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
 
    return (
      <div ref={dropDownRef}>
        <Select 
          options={AIModelOptions} 
          label="Model"
          selectedOption={inputModel} 
          setSelectedOption={setInputModel} 
          handleAsyncStore={handleAsyncStore} 
        />
      </div>
    );
  }
);

export default ModelSelector;


 