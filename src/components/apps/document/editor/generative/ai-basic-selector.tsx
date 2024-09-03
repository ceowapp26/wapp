import React, { useEffect, useState, useCallback } from "react";
import { Command, CommandGroup, CommandItem, CommandSeparator, CommandList } from "../ui/command";
import { useCompletion } from "ai/react";
import { useEditor } from "../core/index";
import { useModelStore } from '@/stores/features/models/store';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useGeneralContext } from '@/context/general-context-provider';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ChatInterface } from '@/types/chat';
import { Button } from "../ui/button";
import MagicIcon from "@/icons/MagicIcon";
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";
import {
  ArrowDownWideNarrow,
  CheckCheck,
  RefreshCcwDot,
  StepForward,
  WrapText,
  FileTerminal,
  FileText,
  FileType,
  MessageSquareText,
  SquarePen,
  ListPlus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { chatAPIEndpointOptions } from "@/constants/ai";
import { setAPIEndpoint } from '@/utils/aiUtils';
import Warning from '@/components/models/warning'; 

const optionsEdit = [
  {
    value: "continue",
    label: "Continue writing",
    icon: StepForward,
  },
  {
    value: "complete",
    label: "Complete writing",
    icon: ListPlus,
  },
  {
    value: "improve",
    label: "Improving writing",
    icon: RefreshCcwDot,
  },
  {
    value: "sorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
  },
  {
    value: "fix",
    label: "Fix Grammar",
    icon: CheckCheck,
  }
];

const optionsMore = [
  {
    value: "adjust",
    label: "Adjust tone",
    icon: FileType,
  },
  
  {
    value: "feedback",
    label: "Feedback",
    icon: MessageSquareText,
  },
  {
    value: "rephrase",
    label: "Rephrase",
    icon: SquarePen,
  },
  {
    value: "summary",
    label: "Summary writing",
    icon: SquarePen,
  },
];

interface AIBasicSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AIBasicSelector = ({ open, onOpenChange }: AIBasicSelectorProps) => {
  const { editor } = useEditor();
  const { t } = useTranslation('api');
  const {
    isLeftSidebarOpened,
    isRightSidebarOpened,
    setIsLeftSidebarOpened,
    setIsRightSidebarOpened,
    leftSidebarType,
    rightSidebarType,
    setLeftSidebarType,
    setRightSidebarType,
  } = useMyspaceContext();
  const { aiContext, setAiContext, setAiModel, setIsSystemModel, setInputType, setOutputType, showWarning, warningType, nextTimeUsage } = useGeneralContext();
  const setChatModel = useDocumentStore((state) => state.setChatModel);
  const setChatContext = useDocumentStore((state) => state.setChatContext);
  const setChats = useDocumentStore((state) => state.setChats);
  const currentChatIndex = useDocumentStore((state) => state.currentChatIndex);
  const inputModel = useModelStore((state) => state.inputModel);
  const updateChat = useMutation(api.chats.updateChat);
  const { handleAIDynamicFunc } = useDynamicSubmit();

  const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex: number, chat: ChatInterface) => {
    try {
      await updateChat({ id: id, chatIndex: chatIndex, chat: chat });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSetup = useCallback(() => {
    setIsSystemModel(false);
    setChatModel(inputModel);
    setChatContext("selection");
    setInputType("text-only");
    setOutputType("text");
    setAiContext("basic");
    setAPIEndpoint(chatAPIEndpointOptions, inputModel);
  }, [setAiContext, setChatContext, setChatModel, setInputType, setOutputType, setIsSystemModel, setAPIEndpoint, chatAPIEndpointOptions, inputModel]);

  const handleGenerate = useCallback(async (role, command, content) => {
    handleSetup();
    if (!content || content.trim() === '' || useDocumentStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useDocumentStore.getState().chats)
    );
    const chatContext = useDocumentStore.getState().chatContext;
    const chatModel = useDocumentStore.getState().chatModel;
    const currentChat = updatedChats[currentChatIndex];
    const chatId = currentChat.chatId;
    if (!currentChat.messages) {
      currentChat.messages = [];
    }
    const newUserMessage = {
      role: role, 
      command: command, 
      content: content, 
      context: chatContext, 
      model: chatModel 
    };
    if (content) {
      currentChat.messages = [...currentChat.messages, newUserMessage];
    }
    setChats(updatedChats);
    await handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
    await handleAIDynamicFunc();
  }, [handleSetup, currentChatIndex, aiContext, setChats, handleUpdateCloudChat, handleAIDynamicFunc]);

  const handleSidebar = useCallback(() => {
    if (leftSidebarType !== 'left-ai') setLeftSidebarType('left-ai');
    if (rightSidebarType !== 'right-ai') setRightSidebarType('right-ai');
    if (!isLeftSidebarOpened) setIsLeftSidebarOpened(true);
    if (!isRightSidebarOpened) setIsRightSidebarOpened(true);
  }, [leftSidebarType, rightSidebarType, isLeftSidebarOpened, isRightSidebarOpened, setLeftSidebarType, setRightSidebarType, setIsLeftSidebarOpened, setIsRightSidebarOpened]);

  const handleSelect = useCallback((option) => {
    const slice = editor.state.selection.content();
    const text = editor.storage.markdown.serializer.serialize(slice.content);
    handleSidebar();
    handleGenerate('user', option.value, text);
  }, [editor, handleSidebar, handleGenerate]);

  return (
    <React.Fragment>
      <Popover modal={true} open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            className="gap-1 rounded-none text-purple-500"
            variant="ghost"
            onClick={() => onOpenChange(true)}
            size="sm"
          >
            <MagicIcon className="h-5 w-5" />
            Ask AI
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          sideOffset={5}
          className="my-1 flex max-h-80 w-60 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl "
          align="start"
        >
          <Command className="w-[350px]">
            <CommandList>
              <CommandGroup heading="Edit or review selection">
                {optionsEdit.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                    className="flex gap-2 px-4"
                    value={option.value}
                  >
                    <option.icon className="h-4 w-4 text-purple-500" />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Use AI to do more">
                {optionsMore.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                    className="flex gap-2 px-4"
                    value={option.value}
                  >
                    <option.icon className="h-4 w-4 text-purple-500" />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {showWarning && (
        <Warning
          type={warningType}
          nextTimeUsage={nextTimeUsage}
          inputModel={chatModel}
        />
      )}
    </React.Fragment>
  );
};

export default AIBasicSelector;
