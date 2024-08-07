"use client"
import React, { useState, useCallback } from 'react';
import { useCompletion } from "ai/react";
import { useModelStore } from "@/stores/features/models/store";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MessageInterface, ModelOption } from "@/types/chat";
import { Grid, Container, Typography } from '@mui/material';
import { cn, Input, Button, Textarea } from "@nextui-org/react";
import { limitMessageTokens, updateTotalTokenUsed } from '@/utils/messageUtils';
import { useGeneralContext } from '@/context/general-context-provider';
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import MagicIcon from "@/icons/MagicIcon";
import CrazySpinnerIcon from "@/icons/CrazySpinnerIcon";
import Warning from '@/components/models/warning'; 
import { X } from 'lucide-react';
import ChatAvatar from './chat-avatar';

const convertToMessageInterface = (
  role: string,
  command: string,
  content: string,
  context: ChatContext,
  model: ModelOption
): MessageInterface => ({
  role,
  command,
  content,
  context,
  model,
});

const AILoadingSpinner = () => (
  <div className="flex h-12 w-full justify-center items-center px-4 text-sm font-medium text-muted-foreground text-purple-500">
    <MagicIcon className="mr-2 h-4 w-4 shrink-0" />
      AI is thinking
    <div className="ml-2 mt-1">
      <CrazySpinnerIcon />
    </div>
  </div>
);

const Chatbot = ({ chatHistory, onSendMessage, portalContext }) => {
  const { t } = useTranslation('api');
  const MAX_WORDS = 255;
  const AIConfig = useModelStore((state) => state.AIConfig);
  const inputContext = useModelStore((state) => state.inputContext);
  const inputModel = useModelStore((state) => state.inputModel);
  const setInputContext = useModelStore((state) => state.setInputContext);
  const setInputModel = useModelStore((state) => state.setInputModel);
  const [_isPromptValid, _setIsPromptValid] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { aiContext, aiModel, showWarning, warningType, nextTimeUsage, setAiContext, setAiModel, setIsSystemModel, setInputType, setOutputType, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { handleAIDynamicFunc } = useDynamicSubmit({ prompt: prompt, option: option, setIsLoading: setIsLoading, setError: setError, onSendMessage: onSendMessage, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage });

  const wordCount = (text) => {
    if(!text) return null;
    return text.trim().split(/\s+/).length;
  };

  const isPromptValid = (text) => {
    if(!text) return null;
    return wordCount(text) <= MAX_WORDS;
  };

  const handleSetup = useCallback(() => {
    setIsSystemModel(true);
    setOption(portalContext);
    setAiContext("portal");
    setInputType("text-only");
    setInputContext("general");
    setOutputType("text");    
  }, [setAiContext, setOption, setInputContext, setInputType, setOutputType, setIsSystemModel]);

  const handlePromptChange = useCallback((value) => {
    const isValid = isPromptValid(value);
    _setIsPromptValid(isValid);
    
    if (isValid) {
      setPrompt(value);
    } else {
      toast.error("Please enter a valid prompt.");
    }
  }, [setPrompt, _setIsPromptValid]);

  const handleAIGenerate = useCallback(async() => {
    handleSetup();
    if (aiContext === "portal" && prompt && option && !isLoading) {
      setIsLoading(true);
      try {
        await handleAIDynamicFunc();
      } catch (error) {
        toast.error("Failed to generate image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [aiContext, isLoading, prompt, option, handleAIDynamicFunc]);
  
  return (
    <Container>
      <div className="flex flex-col h-full max-h-[50vh] gap-y-4 p-4 bg-gray-100 rounded-lg overflow-y-auto">
        {chatHistory.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                flex items-start gap-x-2 max-w-[70%] 
                ${msg.role === 'user' 
                  ? 'flex-row-reverse bg-blue-500 text-white' 
                  : 'bg-white text-gray-800'
                } 
                p-3 rounded-lg shadow-md
              `}
            >
              <ChatAvatar role={msg.role} className="w-8 h-8 flex-shrink-0" />
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className={`text-xs font-semibold mt-2 ${msg.role === 'user' ? 'text-right' : 'text-left'} w-full`}>
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </span>
                <p className="text-sm p-2">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center items-center mt-4">
        <Textarea
          variant="faded"
          labelPlacement="outside"
          placeholder="Ask AI any question"
          value={prompt}
          description="Enter a concise description of what you want AI to generate (max 255 words)."
          onChange={(e) => {
            handlePromptChange(e.target.value);
          }}
          required
          error={!isPromptValid(prompt) && prompt !== ''}
          helperText={!isPromptValid(prompt) && prompt !== '' ? `Prompt exceeds ${MAX_WORDS} words limit` : ''}
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
            description: [
              "pt-2",
            ],
          }}
          startContent={
            <div>
              {prompt && (
                <button
                  className="absolute right-4 top-2 flex items-center justify-center rounded-full w-4 h-4 bg-slate-200 hover:bg-slate-400"
                  onClick={() => {
                    setPrompt('');
                    _setIsPromptValid(true);
                  }}
                  type="button"
                >
                  <X className="w-3 h-3 text-gray-800 cursor-pointer" />
                </button>
              )}
            </div>
          }
          endContent={
            <div className="absolute right-8 bottom-1 flex items-center">
              <span className={`text-tiny ${isPromptValid(prompt) ? 'text-default-400' : 'text-danger'}`}>
                {wordCount(prompt)}/{MAX_WORDS}
              </span>
            </div>
          }
        />
        <Button className="bg-black text-white p-4 mt-4" disabled={isLoading} onClick={handleAIGenerate} fullWidth>
          {isLoading ? <AILoadingSpinner /> : 'Generate'}
        </Button>
      </div>
      {showWarning && (
        <Warning
          type={warningType}
          nextTimeUsage={nextTimeUsage}
          inputModel={inputModel}
        />
      )}
    </Container>
  );
};

export default Chatbot;
