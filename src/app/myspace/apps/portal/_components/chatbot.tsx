"use client"
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import io from 'socket.io-client';
import { useModelStore } from "@/stores/features/models/store";
import Warning from '@/components/models/warning'; 
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MessageInterface, ModelOption } from "@/types/chat";
import { Grid, Container, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeneralContext } from '@/context/general-context-provider';
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import { useAIPortal } from "@/hooks/use-ai-portal";
import { AudioUploadModal } from "./audio-upload-modal";
import { FileUploadModal } from "./file-upload-modal";
import { ImageUploadModal } from "./image-upload-modal";
import MagicIcon from "@/icons/MagicIcon";
import { FaMicrophone, FaUpload } from 'react-icons/fa';
import CrazySpinnerIcon from "@/icons/CrazySpinnerIcon";
import UnreleasePopover from "@/components/apps/chatbot/unrelease-popover";
import { X, ArrowUp, Mic, Paperclip, Image, Video, Music, AlignHorizontalSpaceAround, AlignVerticalSpaceAround, RotateCw, Send, StopCircle } from 'lucide-react';
import { cn, Input, Textarea, Tooltip, ScrollShadow, Button, Popover, PopoverTrigger, PopoverContent, useDisclosure, Listbox, ListboxItem } from '@nextui-org/react';
import ChatAvatar from './chat-avatar';

const AudioInput = ({ onTranscriptionUpdate, onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = 'en-US';

      speechRecognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        onTranscriptionUpdate(interimTranscript);
        if (finalTranscript) {
          onTranscriptionComplete(finalTranscript);
        }
      };

      speechRecognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') {
          setError('No speech was detected. Listening again...');
          setTimeout(() => {
            if (isRecording) {
              recognition.stop();
              recognition.start();
            }
          }, 100);
        } else {
          setError(`Error occurred: ${event.error}`);
          setIsRecording(false);
        }
      };

      speechRecognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(speechRecognition);
    } else {
      setError('Web Speech API is not supported in this browser.');
    }
  }, [onTranscriptionUpdate, onTranscriptionComplete]);

  /*useEffect(() => {
    let restartInterval;
    if (isRecording) {
      restartInterval = setInterval(() => {
        recognition.stop();
        recognition.start();
      }, 5000); 
    }
    return () => clearInterval(restartInterval);
  }, [isRecording, recognition]);*/

  const startRecording = useCallback(() => {
    if (recognition) {
      setError(null);
      recognition.start();
      setIsRecording(true);
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  }, [recognition]);

  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex items-center space-x-4">
        <Button
          isIconOnly
          color={isRecording ? "danger" : "primary"}
          variant="faded"
          aria-label={isRecording ? "Stop Recording" : "Start Recording"}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <StopCircle /> : <Mic />}
        </Button>
        <span>{isRecording ? "Recording..." : "Click to record audio"}</span>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

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
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [audioOption, setAudioOption] = useState<string | null>(null);
  const [fileFormat, setFileFormat] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVertical, setIsVertical] = useState<boolean>(true);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { stop } = useAIPortal();
  const { aiContext, aiModel, showWarning, warningType, nextTimeUsage, setAiContext, setAiModel, setIsSystemModel, setInputType, setOutputType, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { handleAIDynamicFunc } = useDynamicSubmit({ prompt: prompt, option: portalContext, setIsLoading: setIsLoading, setError: setError, onSendMessage: onSendMessage, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage });
  
  const handleAudioUpload = () => {
    setIsAudioModalOpen(true);
  };

  const handleImageProcessed = (result: string) => { 
    setPrompt(result);
    setIsImageModalOpen(false);
  };

  const handleImageUpload = () => {
    setIsImageModalOpen(true);
  };

  const handleFileProcessed = (result: string) => { 
    setPrompt(result);
    setIsFileModalOpen(false);
  };

  const handleFileUpload = () => {
    setIsFileModalOpen(true);
  };

  const handleSwitchOpenModal = (option: "image" | "file" | "audio") => {
    switch (option) {
      case "image":
        handleImageUpload();
        break;
      case "file":
        handleFileUpload();
        break;
      default:
        break;
    }
  };

  const handleTranscriptionUpdate = (newTranscription) => {
    setTranscription(newTranscription);
  };

  const handleTranscriptionComplete = (finalTranscription) => {
    setPrompt(finalTranscription);
    setFileFormat(null);
    setIsAudioModalOpen(false);
  };

  const options = [
    { icon: <Paperclip />, label: 'Upload File', value: "file" },
    { icon: <Mic />, label: 'Audio', value: "audio" },
    { icon: <Image />, label: 'Image', value: "image" },
    { icon: <Video />, label: 'Video', value: "video" },
    { icon: isVertical ?  <AlignVerticalSpaceAround />: <AlignHorizontalSpaceAround />, label: 'Switch Layout' },
  ];

  const wordCount = (text) => {
    if(!text) return null;
    return text.trim().split(/\s+/).length;
  };

  const isPromptValid = (text) => {
    if(!text) return null;
    return wordCount(text) <= MAX_WORDS;
  };

  const toggleLayout = () => {
    setIsVertical(!isVertical);
    setIsOpen(false);
  };

  const handleSetup = useCallback(() => {
    setIsSystemModel(true);
    setAiContext("portal");
    setInputType("text-only");
    setInputContext("general");
    setOutputType("text");
  }, [setAiContext, setInputContext, setInputType, setOutputType, setIsSystemModel, inputModel]);

  const handlePromptChange = useCallback((value) => {
    const isValid = isPromptValid(value);
    _setIsPromptValid(isValid);
    if (isValid) {
      setPrompt(value);
    } else {
      toast.error("Please enter a valid prompt.");
    }
  }, [setPrompt, _setIsPromptValid]);

  const handleAIGenerate = useCallback(async () => {
    handleSetup();
    if (!prompt.trim() || aiContext !== "portal" || isLoading || !portalContext) return;
    setIsLoading(true);
    try {
      await handleAIDynamicFunc();
    } catch (error) {
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setPrompt('');
      setIsLoading(false);
    }
  }, [aiContext, isLoading, prompt, portalContext, handleAIDynamicFunc]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleAIGenerate();
    }
  };

  const GenerateButton: React.FC<GenerateButtonProps> = ({ isGenerating, stop, generate }) => (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        isIconOnly
        variant="faded"
        color="default"
        color={isGenerating ? "danger" : "primary"}
        size="sm"
        onClick={isGenerating ? () => stop : generate}
        aria-label={isGenerating ? "Stop Generating" : "Generate"}
        className="relative overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isGenerating ? (
            <motion.div
              key="stop"
              initial={{ opacity: 0, rotate: 180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              <StopCircle />
            </motion.div>
          ) : (
            <motion.div
              key="send"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Send />
            </motion.div>
          )}
        </AnimatePresence>
        {isGenerating && (
          <motion.div
            className="absolute inset-0 bg-danger-300 opacity-30"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </Button>
    </motion.div>
  );

  const startContent = useMemo(() => (
    <div>
      {prompt && (
        <button 
          aria-label="cancel"
          className="absolute right-32 top-2 flex items-center justify-center rounded-full w-4 h-4 bg-slate-200 hover:bg-slate-400"
          onClick={() => {
            setPrompt('');
            _setIsPromptValid(true);

          }}
          type="button"
        >
          <X className="w-3 h-3 text-gray-800 cursor-pointer" />
        </button>
      )}
      <div className="absolute right-32 bottom-1 flex items-center">
        <span className={`text-tiny ${isPromptValid(prompt) ? 'text-default-400' : 'text-danger'}`}>
          {wordCount(prompt)}/{MAX_WORDS}
        </span>
      </div>
    </div>
  ), [prompt, setPrompt, wordCount, isPromptValid, _setIsPromptValid]);

  const AudioOptionPopover = ({ children, onOptionSelect, setIsAudioModalOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = [
      { key: 'upload', label: 'Upload Audio', icon: <FaUpload /> },
      { key: 'record', label: 'Record Audio', icon: <FaMicrophone /> },
    ];
    return (
      <Popover
        isOpen={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
        placement="bottom"
        offset={10}
      >
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[300px] p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Choose Audio Option
            </h3>
            <div className="space-y-2">
              {options.map((option) => (
                <motion.button
                  key={option.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-between p-3 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  onClick={() => {
                    onOptionSelect(option.key);
                    if (option.key === "upload") setIsAudioModalOpen(true);
                    setIsOpen(false);
                  }}
                >
                  <span className="flex items-center text-gray-700 dark:text-gray-200">
                    {option.icon}
                    <span className="ml-2">{option.label}</span>
                  </span>
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    →
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </PopoverContent>
      </Popover>
    );
  };

  const endContent = useMemo(() => (
    <div className="flex gap-4 justify-center items-center px-2 py-2 h-full">
      <GenerateButton isGenerating={isLoading} stop={stop} generate={handleAIGenerate} />
      {isVertical ? (
        <Popover>
          <PopoverTrigger>
            <Button
              isIconOnly
              variant="faded"
              color="default"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Attach"
            >
              <Paperclip />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <ScrollShadow orientation="vertical" className="h-48 w-14">
              <div className="p-2 bg-white rounded-lg shadow-lg">
                {options.map((option, index) => (
                  option.value === "audio" ? (
                    <AudioOptionPopover key={index} onOptionSelect={setAudioOption} setIsAudioModalOpen={setIsAudioModalOpen}>
                      <Button
                        className="mb-1"
                        isIconOnly
                        variant="faded"
                        color="default"
                        size="sm"
                        onClick={() => {
                          setFileFormat(option.value);
                          handleSwitchOpenModal(option.value);
                        }}
                        aria-label={option.label}
                      >
                        {option.icon}
                      </Button>
                    </AudioOptionPopover>
                  ) : option.value === "video" ? (
                    <UnreleasePopover key={index}>
                      <Button
                        className="mb-1"
                        isIconOnly
                        variant="faded"
                        color="default"
                        size="sm"
                        onClick={() => setFileFormat(option.value)}
                        aria-label={option.label}
                      >
                        {option.icon}
                      </Button>
                    </UnreleasePopover>
                  ) : (
                    <Button
                      key={index}
                      className="mb-1"
                      isIconOnly
                      variant="faded"
                      color="default"
                      size="sm"
                      onClick={() => {
                        setFileFormat(option.value);
                        if (option.label === 'Switch Layout') {
                          toggleLayout();
                        }
                        handleSwitchOpenModal(option.value);
                      }}
                      aria-label={option.label}
                    >
                      {option.icon}
                    </Button>
                  )
                ))}
              </div>
            </ScrollShadow>
          </PopoverContent>
        </Popover>
      ) : (
        <ScrollShadow orientation="horizontal" className="w-20 z-[99]">
          <div className="flex space-x-2 p-2">
            {options.map((option, index) => (
              option.value === "audio" ? (
                <AudioOptionPopover key={index}>
                  <Button
                    className="mb-1"
                    isIconOnly
                    variant="faded"
                    color="default"
                    size="sm"
                    onClick={() => setFileFormat(option.value)}
                    aria-label={option.label}
                  >
                    {option.icon}
                  </Button>
                </AudioOptionPopover>
              ) : option.value === "video" ? (
                <UnreleasePopover key={index}>
                  <Button
                    className="mb-1"
                    isIconOnly
                    variant="faded"
                    color="default"
                    size="sm"
                    onClick={() => setFileFormat(option.value)}
                    aria-label={option.label}
                  >
                    {option.icon}
                  </Button>
                </UnreleasePopover>
              ) : (
                <Button
                  key={index}
                  className="mb-1"
                  isIconOnly
                  variant="faded"
                  color="default"
                  size="sm"
                  onClick={() => {
                    setFileFormat(option.value);
                    if (option.label === 'Switch Layout') {
                      toggleLayout();
                    }
                    handleSwitchOpenModal(option.value);
                  }}                  
                  aria-label={option.label}
                >
                  {option.icon}
                </Button>
              )
            ))}
          </div>
        </ScrollShadow>
      )}
    </div>
  ), [handleAIGenerate, isLoading, stop, isOpen, isVertical, options, setFileFormat]);

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
        {fileFormat === "audio" && audioOption === "record" && (
          <AudioInput 
            onTranscriptionUpdate={handleTranscriptionUpdate}
            onTranscriptionComplete={handleTranscriptionComplete}
          />
        )}
        {fileFormat === "audio" && audioOption === "upload" && isAudioModalOpen && (
          <AudioUploadModal
            onTranscriptionComplete={handleTranscriptionComplete}
            isOpen={isAudioModalOpen}
            onClose={() => setIsAudioModalOpen(false)}
          />
        )}
         {fileFormat === "file" && (
          <FileUploadModal
            onFileProcessed={handleFileProcessed}
            isOpen={isFileModalOpen}
            onClose={() => setIsFileModalOpen(false)}
          />
        )}
        {fileFormat === "image" && (
          <ImageUploadModal
            onImageProcessed={handleImageProcessed}
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
          />
        )}
        <Textarea
          variant="faded"
          labelPlacement="outside"
          placeholder="Ask AI any question"
          description="Enter a concise description of what you want AI to generate (max 255 words)."
          value={prompt}
          onChange={(e) => {
            handlePromptChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          required
          error={!isPromptValid(prompt) && prompt !== ''}
          helperText={!isPromptValid(prompt) && prompt !== '' ? `Prompt exceeds ${MAX_WORDS} words limit` : ''}
          startContent={startContent}
          endContent={endContent}
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
        />
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

