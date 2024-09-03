import React, { useState, useEffect, memo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { CodeProps, ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import { ChatInterface } from '@/types/chat';
import { codeLanguageSubset } from '@/constants/chat';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Tooltip, Button, ScrollShadow } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonGroup, ActionButtons } from './action-buttons';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { useGeneralContext } from "@/context/general-context-provider";
import TickIcon from '@/icons/TickIcon';
import CrossIcon from '@/icons/CrossIcon';
import MagicIcon from "@/icons/MagicIcon";
import CrazySpinnerIcon from "@/icons/CrazySpinnerIcon";
import EnhancedMarkdown from "./enhanced-markdown";
import EnhancedTextDisplay from "./enhanced-textdisplay";

const AIGeneratingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center bg-violet-300/50 rounded-lg px-2 py-2 ml-2"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mr-3 bg-violet-400/75 rounded-full"
      >
        <MagicIcon className="w-7 h-7 text-white" />
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-purple-800 font-semibold"
      >
        AI is thinking
      </motion.span>
      <motion.div className="ml-2 flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-purple-700/90 rounded-full"
            animate={{
              y: ["0%", "-50%", "0%"],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

const ContentView = memo(
  ({
    role,
    content,
    command,
    context,
    model,
    setIsEdit,
    messageIndex,
  }: {
    role: string;
    content: string;
    command: string;
    context: string;
    model: string;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    messageIndex: number;
  }) => {
    const { rightSidebarWidth } = useMyspaceContext();
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [isMarkdownMode, setIsMarkdownMode] = useState<boolean>(false);
    const currentChatIndex = useDocumentStore((state) => state.currentChatIndex);
    const setChats = useDocumentStore((state) => state.setChats);
    const lastMessageIndex = useDocumentStore((state) =>
      state.chats ? state.chats[state.currentChatIndex].messages.length - 1 : 0
    );
    const chatContext = useDocumentStore((state) => state.chatContext);
    const setChatContext = useDocumentStore((state) => state.setChatContext);
    const inlineLatex = useDocumentStore((state) => state.inlineLatex);
    const markdownMode = useDocumentStore((state) => state.markdownMode);
    const setMarkdownMode = useDocumentStore((state) => state.setMarkdownMode);
    const updateChat = useMutation(api.chats.updateChat);
    const MEDIUM_SCREEN_THRESHOLD = 540;
    const [isMediumScreen, setIsMediumScreen] = useState(false);
    const { aiContext, setAiContext, setAiModel, setInputType, setOutputType } = useGeneralContext();

    useEffect(() => {
      setIsMediumScreen(rightSidebarWidth < MEDIUM_SCREEN_THRESHOLD);
    }, [rightSidebarWidth]);

    
    const handleUpdateCloudChat = async (id: Id<"chats">, chatIndex: number, chat: ChatInterface) => {
      try {
        await updateChat({ id: id, chatIndex: chatIndex, chat: chat });
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    const handleDelete = () => {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(useDocumentStore.getState().chats));
      const currentChat = updatedChats[currentChatIndex];
      currentChat.messages.splice(messageIndex, 1);
      setChats(updatedChats);
      handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
    };

    const handleMove = (direction: 'up' | 'down') => {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(useDocumentStore.getState().chats));
      const currentChat = updatedChats[currentChatIndex];
      const updatedMessages = currentChat.messages;
      const temp = updatedMessages[messageIndex];
      if (direction === 'up') {
        updatedMessages[messageIndex] = updatedMessages[messageIndex - 1];
        updatedMessages[messageIndex - 1] = temp;
      } else {
        updatedMessages[messageIndex] = updatedMessages[messageIndex + 1];
        updatedMessages[messageIndex + 1] = temp;
      }
      setChats(updatedChats);
      handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
    };

    const handleMoveUp = () => handleMove('up');
    const handleMoveDown = () => handleMove('down');

    const handleSetup = useCallback(() => {
      setAiContext("basic");
      setChatContext("general");
      setInputType("text-only");
      setOutputType("text");
    }, [setAiContext, setChatContext, setInputType, setOutputType]);

    const handleGenerate = () => {
      handleSetup();
      handleAIDynamicFunc();
    }; 
    
    const handleRegenerate = () => {
      const updatedChats: ChatInterface[] = JSON.parse(JSON.stringify(useDocumentStore.getState().chats));
      const currentChat = updatedChats[currentChatIndex];
      const updatedMessages = currentChat.messages;
      updatedMessages.splice(updatedMessages.length - 1, 1);
      setChats(updatedChats);
      handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
      handleGenerate();
    };

    const handleToggleMarkdownMode = () => {
      setMarkdownMode(!markdownMode);
      setIsMarkdownMode(!isMarkdownMode);
    }; 
    
    const handleCopy = () => navigator.clipboard.writeText(content);
    const handleReplace = () => useDocumentStore.getState().replaceAI(content);
    const handleInsertAbove = () => useDocumentStore.getState().insertAboveAI(content);
    const handleInsertBelow = () => useDocumentStore.getState().insertBelowAI(content);
    const handleInsertLeft = () => useDocumentStore.getState().insertLeftAI(content);
    const handleInsertRight = () => useDocumentStore.getState().insertRightAI(content);

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-lg bg-white dark:bg-gray-800 shadow-md overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${role === 'assistant' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {role === 'assistant' ? 'AI' : 'You'}
              </span>
              {useDocumentStore.getState().generating && role === "assistant" && messageIndex === lastMessageIndex && (
                <AIGeneratingIndicator />
              )}
            </div>
            {markdownMode ? (
              <EnhancedMarkdown content={content} inlineLatex={inlineLatex} />
            ) : (
              <EnhancedTextDisplay content={content} />              
            )}
          </div>
        </motion.div>
        <ActionButtons
          isDelete={isDelete}
          handleDelete={handleDelete}
          setIsDelete={setIsDelete}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleEdit={() => setIsEdit(true)}
          handleRegenerate={handleRegenerate}
          handleCopy={handleCopy}
          handleReplace={handleReplace}
          handleInsertAbove={handleInsertAbove}
          handleInsertBelow={handleInsertBelow}
          handleInsertLeft={handleInsertLeft}
          handleInsertRight={handleInsertRight}
          markdownMode={isMarkdownMode}
          setMarkdownMode={handleToggleMarkdownMode}
          messageIndex={messageIndex}
          isMediumScreen={isMediumScreen}
          currentChatIndex={currentChatIndex}
          lastMessageIndex={lastMessageIndex}
        />
      </>
    );
  }
);

export default ContentView;




