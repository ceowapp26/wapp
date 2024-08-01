import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useChatMetadatas } from '@/hooks/use-chat-metadatas';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { useGeneralContext } from '@/context/general-context-provider';
import { useStore } from "@/redux/features/apps/document/store";
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import { Wand2, AlertTriangle } from 'lucide-react';
import { useTranslation } from "react-i18next";
import Warning from '@/components/models/warning'; 

const AIGeneratingSpinner = () => (
  <div className="flex items-center space-x-2 text-purple-600 animate-pulse">
    <Wand2 className="h-5 w-5" />
    <span className="text-sm font-medium">AI is thinking...</span>
  </div>
);

const ChatMetadataModal = () => {
  const { t } = useTranslation();
  const { isOpen, onClose } = useChatMetadatas();
  const updateChat = useMutation(api.chats.updateChat);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const setInputContext = useStore((state) => state.setInputContext);
  const setInputModel = useStore((state) => state.setInputModel);
  const setChats = useStore((state) => state.setChats);
  const { aiContext, showWarning, warningType, nextTimeUsage, setAiContext, setAiModel, setInputType, setOutputType, setShowWarning, setWarningType, setNextTimeUsage, selectedDocument } = useGeneralContext();
  const { handleAIDynamicFunc } = useDynamicSubmit({ setIsLoading: setIsLoading, setError: setError, setTitle: setTitle, setDescription: setDescription, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage });

  const handleUpdateCloudChat = async (id, chatIndex, chat) => {
    try {
      await updateChat({ id:id , chatIndex: chatIndex, chat });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSetup = useCallback(() => {
    setAiContext("chatMetadata");
    setInputContext("general");
    setAiModel("openAI");
    setInputModel("gpt-3.5-turbo");
    setInputType("text-only");
    setOutputType("text");
  }, [setAiContext, setAiModel, setInputContext, setInputModel, setInputType, setOutputType]);

  const handleAIGenerate = useCallback(async () => {
    if (aiContext === "chatMetadata" && !isLoading) {
      try {
        setIsLoading(true);
        await handleAIDynamicFunc();
      } catch (error) {
        console.error("Error generating metadata:", error);
        setError("Failed to generate metadata. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [aiContext, isLoading, setIsLoading, handleAIDynamicFunc]);

  const handleSubmit = useCallback(async () => {
    handleSetup();
    await new Promise(resolve => setTimeout(resolve, 0));
    await handleAIGenerate();
  }, [handleSetup, handleAIGenerate]);

  const editTitle = (title) => {
    const updatedChats = JSON.parse(JSON.stringify(useStore.getState().chats));
    updatedChats[chatIndex].chatTitle = title;
    setChats(updatedChats);
    const chatId = updatedChats[chatIndex].chatId;
    const newChatIndex = updatedChats.findIndex((chat) => chat.chatId === selectedDocument);
    handleUpdateCloudChat(updatedChats[chatIndex].cloudChatId, newChatIndex, updatedChats[chatIndex]);
  };

  const handleUpdateTitle = () => {
    if (!selectedDocument || !title) return;
    const extractedTitle = title.trim().replace(/^"(.*)"$/, '$1');
    editTitle(extractedTitle);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Chat Metadata</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">AI Generator</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</h4>
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md min-h-[40px]">
                  {isLoading && !title ? <AIGeneratingSpinner /> : 
                    <p className="text-md text-violet-700 dark:text-violet-400 font-semibold">
                      {title || "Generate Title of the Chat"}
                    </p>
                  }
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md min-h-[40px]">
                  {isLoading && !description ? <AIGeneratingSpinner /> : 
                    <p className="text-md text-violet-700 dark:text-violet-400 font-semibold">
                      {description || "Generate Description of the Document"}
                    </p>
                  }
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div className="flex items-center space-x-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          <div className="flex justify-between">
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full mr-2">
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
            <Button onClick={handleUpdateTitle} disabled={isLoading || !title} className="w-full ml-2">
              Update Title
            </Button>
          </div>
        </div>
        {showWarning && (
          <Warning
            type={warningType}
            nextTimeUsage={nextTimeUsage}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatMetadataModal;