import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { useStore } from '@/redux/features/apps/document/store';
import { useSubmit } from '@/hooks/use-submit';
import { ChatInterface } from '@/types/chat';
import PopupModal from './popup-modal';
import TokenCount from './token-count';
import CharacterCount from './character-count';
import CommandPrompt from './command-prompt';
import contexts from '@/types/chat';
import { X, ArrowUp, Mic, Paperclip, Image, Video, Music, AlignHorizontalSpaceAround, AlignVerticalSpaceAround } from 'lucide-react';
import { Textarea, Tooltip, ScrollShadow, Button, Popover, PopoverTrigger, PopoverContent, useDisclosure } from '@nextui-org/react';
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import { APP_STATUS } from "@/constants/app";
import { motion } from "framer-motion";
import { FiSave, FiX, FiZap } from 'react-icons/fi';
import UnreleasePopover from "./unrelease-popover";
import { useGeneralContext } from "@/context/general-context-provider";
import { useMyspaceContext } from "@/context/myspace-context-provider";

const ChatView = ({
  content,
  command,
  context,
  model,
  setIsEdit,
  messageIndex,
  sticky,
} : {
  content: string;
  command: string;
  context: string;
  model: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  sticky?: boolean;
}) => {
  const MEDIUM_SCREEN_THRESHOLD = 540;
  const { t } = useTranslation();
  const inputRole = useStore((state) => state.inputRole);
  const setInputRole = useStore((state) => state.setInputRole);
  const inputContext = useStore((state) => state.inputContext);
  const inputModel = useStore((state) => state.inputModel);
  const setInputModel = useStore((state) => state.setInputModel);
  const setInputContext = useStore((state) => state.setInputContext);
  const setChats = useStore((state) => state.setChats);
  const setApiEndpoint = useStore((state) => state.setApiEndpoint);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const apiEndpoint = useStore((state) => state.apiEndpoint);
  const setLoading = useStore((state) => state.setLoading);
  const [_content, _setContent] = useState<string>(content);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const textareaRef = React.createRef<HTMLTextAreaElement>();
  const updateChat = useMutation(api.chats.updateChat);
  const currentUser = useQuery(api.users.getCurrentUser);
  const { aiContext, setAiContext, setAiModel, setInputType, setOutputType } = useGeneralContext();
  const { rightSidebarWidth } = useMyspaceContext();
  const [isVertical, setIsVertical] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { handleAIDynamicFunc } = useDynamicSubmit();
  const popupModal = useDisclosure();
  const isMediumScreen = useMemo(() => rightSidebarWidth < MEDIUM_SCREEN_THRESHOLD, [rightSidebarWidth]); 

  const options = [
    { icon: <Paperclip />, label: 'Upload File' },
    { icon: <Mic />, label: 'Audio' },
    { icon: <Image />, label: 'Image' },
    { icon: <Video />, label: 'Video' },
    { icon: isVertical ?  <AlignHorizontalSpaceAround />: <AlignVerticalSpaceAround />, label: 'Switch Layout' },
  ];

  const toggleLayout = () => {
    setIsVertical(!isVertical);
    setIsOpen(false);
  };

  const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex: number, chat: ChatInterface) => {
    try {
      await updateChat({ id: id, chatIndex: chatIndex, chat: chat });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|playbook|silk/i.test(
        navigator.userAgent
      );
    if (e.key === 'Enter' && !isMobile && !e.nativeEvent.isComposing) {
      const enterToSubmit = useStore.getState().enterToSubmit;
      if (e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        handleGenerate();
        return; 
      } else if (
        (enterToSubmit && !e.shiftKey) ||
        (!enterToSubmit && (e.ctrlKey || e.shiftKey))
      ) {
        if (sticky) {
          e.preventDefault();
          handleGenerate();
          return; 
        } else {
          handleSave();
        }
      }
    }
  };

  const handleSave = () => {
    if (sticky && (_content === '' || _content.trim() === '' || useStore.getState().generating)) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const currentChat = updatedChats[currentChatIndex];
    if (sticky) {
      currentChat.messages.push({ role: inputRole, content: _content, command: "zap", context: context, model: model });
      _setContent('');
    } else {
      currentChat.messages[messageIndex].content = _content;
      setIsEdit(false);
    }
    setChats(updatedChats);
    handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
  };

  const handleSetup = useCallback(() => {
    setInputRole("user");
    setAiContext("basic");
    setInputContext("general");
    setInputType("text-only");
    setOutputType("text");
  }, [setAiContext, setInputContext, setInputType, setOutputType]);

  const handleGenerate = useCallback(async() => {
    handleSetup();
    if (_content === '' || _content.trim() === '' || useStore.getState().generating) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(useStore.getState().chats)
    );
    const currentChat = updatedChats[currentChatIndex];
    if (!currentChat.messages) {
      currentChat.messages = [];
    }
    const newUserMessage = {
      role: inputRole,
      content: _content,
      command: "zap",
      context: inputContext,
      model: inputModel,
    };
    if (sticky) {
      currentChat.messages = [...currentChat.messages, newUserMessage];
      _setContent('');
    } else {
      if (messageIndex >= 0 && messageIndex < currentChat.messages.length) {
        currentChat.messages[messageIndex] = newMessage;
        currentChat.messages = currentChat.messages.slice(0, messageIndex + 1);
      } else {
        currentChat.messages = [...currentChat.messages, newUserMessage];
      }
      setIsEdit(false);
    }
    setChats(updatedChats);
    await handleUpdateCloudChat(
      currentChat.cloudChatId,
      currentChat.chatIndex,
      currentChat
    );
    handleAIDynamicFunc();
  }, [
    _content,
    aiContext,
    currentChatIndex,
    messageIndex,
    sticky,
    inputRole,
    inputContext,
    inputModel,
    handleSetup,
    handleUpdateCloudChat,
    handleAIDynamicFunc,
    setChats,
    setIsEdit,
    _setContent
  ]); 

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [_content]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const endContent = useMemo(() => (
    <div className="flex gap-4 justify-center items-center px-2 h-full">
      <Button isIconOnly variant="faded" color="default" size="sm" onClick={handleGenerate} aria-label="Send">
        <ArrowUp />        
      </Button>  
      {isVertical && 
        <Popover>
          <PopoverTrigger>
            <Button isIconOnly variant="faded" color="default" size="sm" onClick={() => setIsOpen(!isOpen)} aria-label="Attach">
              <Paperclip />        
            </Button> 
          </PopoverTrigger>
          <PopoverContent>
            <ScrollShadow orientation="vertical" className="h-48 w-14">
              <div className="p-2 bg-white rounded-lg shadow-lg">
                {options.map((option, index) => (
                  <UnreleasePopover>
                    <Button className="mb-1" isIconOnly variant="faded" color="default" size="sm" onClick={option.label === 'Switch Layout' ? toggleLayout : () => {}} aria-label={option.label}>
                      {option.icon}      
                    </Button> 
                  </UnreleasePopover>
                ))}
              </div>
            </ScrollShadow>
          </PopoverContent>
        </Popover>
      }
      {!isVertical && (
        <ScrollShadow orientation="horizontal" className="w-20 z-[99]">
          <div className="flex space-x-2 p-2">
            {options.map((option, index) => (
              <UnreleasePopover>
                <Button isIconOnly variant="faded" color="default" size="sm" onClick={option.label === 'Switch Layout' ? toggleLayout : () => {}} aria-label={option.label}>
                  {option.icon}      
                </Button> 
              </UnreleasePopover>
            ))}
          </div>
        </ScrollShadow>
      )}
    </div>
  ), [handleGenerate, _content, isOpen, setIsOpen, isVertical]);

  const startContent = useMemo(() => (
    <div>
      {_content && (
        <button 
          aria-label="cancel"
          className="absolute right-32 top-2 flex items-center justify-center rounded-full w-4 h-4 bg-slate-200 hover:bg-slate-400"
          onClick={() => {
            _setContent('');
            setCharacterCount(0);
          }}
          type="button"
        >
          <X className="w-3 h-3 text-gray-800 cursor-pointer" />
        </button>
      )}
      <CharacterCount numofCharacter={characterCount} />
    </div>
  ), [_content, _setContent, setCharacterCount]);

  return (
    <>
     <div className="relative flex flex-col w-full max-w-3xl mx-auto mt-4">
        <Textarea
          ref={textareaRef}
          className="m-0 w-full h-full resize-none overflow-y-hidden bg-transparent dark:bg-transparent max-h-[25dvh] max-h-52 overflow-auto"
          classNames={{
            input: "resize-y",
            inputWrapper: [
              "w-full h-full mt-4",
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
          }}
          onChange={(e) => {
            _setContent(e.target.value);
            setCharacterCount(e.target.value.trim().length);
          }}
          startContent={startContent}
          endContent={endContent}
          value={_content}
          placeholder={t('submitPlaceholder')}
          onKeyDown={handleKeyDown}
          minRows={1}
          maxRows={4}
          variant="flat"
        />
      </div>
      <EditViewButtons
        sticky={sticky}
        handleGenerate={handleGenerate}
        handleSave={handleSave}
        setIsModalOpen={popupModal.onOpen}
        setIsEdit={setIsEdit}
        setContent={_setContent}
        setCharacterCount={setCharacterCount}
        characterCount={characterCount}
        isMediumScreen={isMediumScreen}
      />
      <PopupModal
        isModalOpen={popupModal.isOpen}
        setIsModalOpen={popupModal.onOpenChange}
        title={t('warning') as string}
        message={t('clearMessageWarning') as string}
        handleConfirm={handleGenerate}
      />
    </>
  );
};

interface EditViewButtonsProps {
  sticky?: boolean;
  handleGenerate: () => void;
  handleSave: () => void;
  setIsModalOpen: () => void;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setCharacterCount: React.Dispatch<React.SetStateAction<number>>;
  characterCount: number;
  isMediumScreen: boolean;
}

const EditViewButtons: React.FC<EditViewButtonsProps> = memo(({
  sticky = false,
  handleGenerate,
  handleSave,
  setIsModalOpen,
  setIsEdit,
  setContent,
  setCharacterCount,
  characterCount,
  isMediumScreen,
}) => {
  const { t } = useTranslation();
  const generating = useStore((state) => state.generating);
  const advancedMode = useStore((state) => state.advancedMode);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md"
    >
      <div className="flex flex-wrap justify-center gap-2">
        <Tooltip content={generating ? t('generatingInProgress') : t('generate')}>
          <Button
            auto
            color="primary"
            icon={<FiZap />}
            disabled={generating}
            onClick={sticky ? handleGenerate : () => setIsModalOpen()}
          >
            {t('generate')}
          </Button>
        </Tooltip>
        <Tooltip content={t('save')}>
          <Button
            auto
            color="success"
            icon={<FiSave />}
            disabled={generating}
            onClick={handleSave}
          >
            {t('save')}
          </Button>
        </Tooltip>
        {!sticky && (
          <Tooltip content={t('cancel')}>
            <Button
              auto
              color="error"
              icon={<FiX />}
              onClick={() => setIsEdit(false)}
            >
              {t('cancel')}
            </Button>
          </Tooltip>
        )}
      </div>
      <div className="w-full sm:w-auto">
        <CommandPrompt 
          setContent={setContent} 
          setCharacterCount={setCharacterCount} 
        />
      </div>
      {advancedMode && !isMediumScreen && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('tokenCount')}: {characterCount}
        </div>
      )}
    </motion.div>
  );
});

export default ChatView;

