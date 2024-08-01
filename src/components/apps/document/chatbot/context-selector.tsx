import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/redux/features/apps/document/store';
import { ChatInterface, Context } from '@/types/chat';
import { useHideOnOutsideClick } from '@/hooks/use-hideon-outside-click';
import { useMutation } from "convex/react";
import { Select } from "@/components/ui/nextui-select";
import { AIContextOptions } from "@/constants/chat";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const ContextSelector = React.memo(
  ({
    context,
    messageIndex,
    sticky,
  }: {
    context: Context;
    messageIndex: number;
    sticky?: boolean;
  }) => {
    const { t } = useTranslation();
    const inputContext = useStore((state) => state.inputContext);
    const setInputContext = useStore((state) => state.setInputContext);
    const setChats = useStore((state) => state.setChats);
    const currentChatIndex = useStore((state) => state.currentChatIndex);
    const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();
    const updateChat = useMutation(api.chats.updateChat);

    const handleAsyncStore = () => {
      if (!sticky) {
        const updatedChats: ChatInterface[] = JSON.parse(
          JSON.stringify(useStore.getState().chats)
        );
        const currentChat = updatedChats[currentChatIndex];
        currentChat.messages[messageIndex].context = inputContext;
        setChats(updatedChats);
        handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
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
          options={AIContextOptions} 
          label={"Context"}
          selectedOption={inputContext} 
          setSelectedOption={setInputContext} 
          handleAsyncStore={handleAsyncStore} 
        />
      </div>
    );
  }
);

export default ContextSelector;

