import React, { memo, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import io from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { ChatInterface } from '@/types/chat';
import { setAPIEndpoint } from '@/utils/aiUtils';
import { chatAPIEndpointOptions } from '@/constants/ai';
import PopupModal from './popup-modal';
import TokenCount from './token-count';
import CharacterCount from './character-count';
import CommandPrompt from './command-prompt';
import { AudioUploadModal } from "./audio-upload-modal";
import { FileUploadModal } from "./file-upload-modal";
import { ImageUploadModal } from "./image-upload-modal";
import { X, ArrowUp, Mic, Paperclip, Image, Video, Music, AlignHorizontalSpaceAround, AlignVerticalSpaceAround, RotateCw, Send, StopCircle, RefreshCw, FileText, FileImage, FileAudio, ListTree, Eye } from 'lucide-react';
import { cn, Input, Textarea, Tooltip, ScrollShadow, Button, Popover, PopoverTrigger, PopoverContent, useDisclosure, Listbox, ListboxItem, Progress, Card, CardBody, CardFooter } from '@nextui-org/react';
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSubmit } from "@/hooks/use-submit";
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import { APP_STATUS } from "@/constants/app";
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiX, FiZap } from 'react-icons/fi';
import { FaMicrophone, FaUpload } from 'react-icons/fa';
import UnreleasePopover from "./unrelease-popover";
import { FileInterface } from "@/types/chat";
import { useGeneralContext } from "@/context/general-context-provider";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import SystemFile from "./system-file";
import WarningModal from "./warning-modal";
import { ChatSession } from "@/utils/aiUtils";

const AudioInput = ({ onTranscriptionUpdate, onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(0);
  const [transcription, setTranscription] = useState('');
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

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
        setTranscription(interimTranscript);
        onTranscriptionUpdate(interimTranscript);
        
        if (finalTranscript) {
          onTranscriptionComplete(finalTranscript);
        }
      };
      
      speechRecognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') {
          setError('No speech detected. Try again.');
          restartRecognition();
        } else {
          setError(`Error: ${event.error}`);
          setIsRecording(false);
        }
      };
      
      speechRecognition.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(speechRecognition);
    } else {
      setError('Web Speech API not supported in this browser.');
    }
    
    // Set up audio context for visualization
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    analyser.current = audioContext.current.createAnalyser();
    dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
    
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [onTranscriptionUpdate, onTranscriptionComplete]);

  const startRecording = useCallback(() => {
    if (recognition) {
      setError(null);
      recognition.start();
      setIsRecording(true);
      
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const source = audioContext.current.createMediaStreamSource(stream);
          source.connect(analyser.current);
          visualize();
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
          setError('Unable to access microphone');
        });
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
      cancelAnimationFrame(animationRef.current);
    }
  }, [recognition]);

  const restartRecognition = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop();
      setTimeout(() => {
        recognition.start();
      }, 100);
    }
  }, [recognition, isRecording]);

  const visualize = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    analyser.current.fftSize = 256;
    const bufferLength = analyser.current.frequencyBinCount;
    
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.current.getByteFrequencyData(dataArray.current);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray.current[i] / 2;

        canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }

      // Update volume indicator
      const sum = dataArray.current.reduce((a, b) => a + b, 0);
      const avg = sum / dataArray.current.length;
      setVolume(avg);
    };

    draw();
  };

  return (
    <Card className="w-full mx-auto">
      <CardBody className="flex flex-col items-center space-y-4">
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full"
            >
              <canvas ref={canvasRef} width="300" height="100" className="w-full" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center space-x-4">
          <Button
            isIconOnly
            color={isRecording ? "danger" : "primary"}
            variant={isRecording ? "shadow" : "solid"}
            aria-label={isRecording ? "Stop Recording" : "Start Recording"}
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-16 h-16 rounded-full transition-all duration-300 ${
              isRecording ? 'animate-pulse' : ''
            }`}
          >
            {isRecording ? (
              <StopCircle className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
          
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              {isRecording ? "Recording..." : "Click to record"}
            </span>
            {isRecording && (
              <Progress
                size="sm"
                color="danger"
                aria-label="Volume"
                value={volume}
                className="max-w-md"
              />
            )}
          </div>
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm"
          >
            {error}
          </motion.p>
        )}
        
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <p className="text-sm">{transcription}</p>
          </motion.div>
        )}
      </CardBody>
      
      <CardFooter className="justify-end">
        <Button
          isIconOnly
          color="default"
          variant="light"
          aria-label="Restart Recognition"
          onClick={restartRecognition}
          disabled={!isRecording}
        >
          <RefreshCw className="w-5 h-5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

interface GenerateButtonProps {
  isGenerating: boolean;
  stop: () => void;
  generate: () => void;
}

const ChatView = ({
  content,
  command,
  context,
  model,
  setIsEdit,
  messageIndex,
  sticky,
  isCode,
  currentEmbeddedFile,
  setCurrentEmbeddedFile,
  setCurrentComponent,
} : {
  content: string;
  command: string;
  context: string;
  model: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  messageIndex: number;
  sticky?: boolean;
  isCode?: boolean;
  currentEmbeddedFile?: FileInterface,
  setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  setCurrentComponent?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const MEDIUM_SCREEN_THRESHOLD = 540;
  const SMALL_SCREEN_THRESHOLD = 500;
  const { t } = useTranslation();
  const chatRole = usePortalStore((state) => state.chatRole);
  const setChatRole = usePortalStore((state) => state.setChatRole);
  const chatContext = usePortalStore((state) => state.chatContext);
  const chatModel = usePortalStore((state) => state.chatModel);
  const setChatModel = usePortalStore((state) => state.setChatModel);
  const setChatContext = usePortalStore((state) => state.setChatContext);
  const setChats = usePortalStore((state) => state.setChats);
  const setCurrentChatIndex = usePortalStore((state) => state.setCurrentChatIndex);
  const currentChatIndex = usePortalStore((state) => state.currentChatIndex);
  const setLoading = usePortalStore((state) => state.setLoading);
  const setCodeGenerator = usePortalStore((state) => state.setCodeGenerator);
  const [_content, _setContent] = useState<string>(content);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const textareaRef = React.createRef<HTMLTextAreaElement>();
  const updateChat = useMutation(api.chats.updateChat);
  const currentUser = useQuery(api.users.getCurrentUser);
  const { aiContext, setAiContext, setAiModel, setInputType, setOutputType, setIsSystemModel } = useGeneralContext();
  const { rightSidebarWidth } = useMyspaceContext();
  const { stop } = useSubmit();
  const popupModal = useDisclosure();
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVertical, setIsVertical] = useState(true);
  const [transcription, setTranscription] = useState('');
  const [audioOption, setAudioOption] = useState<string | null>(null);
  const [fileFormat, setFileFormat] = useState<string | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

  useEffect(() => {
    if (chatModel && currentChatIndex !== undefined) {
      const updatedChats: ChatInterface[] = JSON.parse(
        JSON.stringify(usePortalStore.getState().chats)
      );
      const currentChat = updatedChats[currentChatIndex];
      const newChatSession = new ChatSession(chatModel);
      currentChat.messages.forEach(message => {
        const { role, content, embeddedContent } = message;
        newChatSession.addMessage({ role, content, embeddedContent });
      });
      setChatSession(newChatSession);
    }
  }, [chatModel, currentChatIndex]);

  useEffect(() => {
    if (chatSession?.isWarning()) {
      setIsWarningModalOpen(true);
    } else {
      setIsWarningModalOpen(false);
    }
  }, [chatSession]);

  useEffect(() => {
    setIsMediumScreen(rightSidebarWidth < MEDIUM_SCREEN_THRESHOLD);
    setIsSmallScreen(rightSidebarWidth < SMALL_SCREEN_THRESHOLD);
  }, [rightSidebarWidth]);

  const { handleAIDynamicFunc } = useDynamicSubmit({ isCode: isCode, chatSession: chatSession });

  const handleFilesProcessed = (newFiles) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAudioUpload = () => {
    setIsAudioModalOpen(true);
  };

  const handleImageUpload = () => {
    setIsImageModalOpen(true);
  };

  const handleFileUpload = () => {
    setIsFileModalOpen(true);
  };

   const handleSystemFile = () => {
    setIsSystemModalOpen(true);
  };

  const handlePreviewFile = (file: FileInterface) => {
    if (!isCode) return;
    setCurrentComponent(null);
    setCurrentEmbeddedFile(file);
  }

  const handleSwitchOpenModal = (option: "image" | "file" | "audio" | "system") => {
    switch (option) {
      case "image":
        handleImageUpload();
        break;
      case "file":
        handleFileUpload();
        break;
      case "system":
        handleSystemFile();
        break;
      default:
        break;
    }
  };

  const handleTranscriptionUpdate = (newTranscription) => {
    setTranscription(newTranscription);
  };

  const handleTranscriptionComplete = (finalTranscription) => {
    _setContent(finalTranscription);
    setFileFormat(null);
    setIsAudioModalOpen(false);
  };

  const handleAutoStrip = () => {
    if (!chatSession) return;
    chatSession.handleAutoStrip();
    handleGenerate();
  };

  const handleAutoSummarize = () => {
    if (!chatSession) return;
    chatSession.handleAutoSummarize();
    handleGenerate();
  };

  const options = [
    { icon: <Paperclip />, label: 'Upload File', value: "file" },
    { icon: <Mic />, label: 'Audio', value: "audio" },
    { icon: <Image />, label: 'Image', value: "image" },
    { icon: <Video />, label: 'Video', value: "video" },
    { icon: <ListTree />, label: 'Choose from system', value: "system" },
    { icon: isVertical ?  <AlignVerticalSpaceAround />: <AlignHorizontalSpaceAround />, label: 'Switch Layout' },
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
      const enterToSubmit = usePortalStore.getState().enterToSubmit;
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
    if (sticky && (_content === '' || _content.trim() === '' || usePortalStore.getState().generating)) return;
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(usePortalStore.getState().chats)
    );
    const currentChat = updatedChats[currentChatIndex];
    if (sticky) {
      currentChat.messages.push({ role: chatRole, content: _content, command: "zap", context: context, model: model });
      _setContent('');
      setUploadedFiles([]);
    } else {
      currentChat.messages[messageIndex].content = _content;
      setIsEdit(false);
    }
    setChats(updatedChats);
    handleUpdateCloudChat(currentChat.cloudChatId, currentChat.chatIndex, currentChat);
  };

  const handleSetup = useCallback(() => {
    setIsSystemModel(false);
    setChatRole("user");
    setAiContext("basic");
    setChatContext("general");
    setInputType("text-only");
    setOutputType("text");
    setAPIEndpoint(chatAPIEndpointOptions, chatModel)
  }, [setAiContext, setChatContext, setInputType, setOutputType, setAPIEndpoint, setIsSystemModel, chatAPIEndpointOptions, chatModel]);

  const handleGenerate = useCallback(async() => {
    handleSetup();
    if (_content === '' &&  uploadedFiles.length === 0 ||  _content.trim() === '' && uploadedFiles.length === 0 || usePortalStore.getState().generating) return;
    const _embeddedContent: FileInterface[] = uploadedFiles.length > 0
    ? uploadedFiles.map(file => ({
        name: file.name,
        content: file.content,
        type: file.type,
        size: file.size
      }))
    : [];
    if (!chatSession) {
      setChatSession(new ChatSession(chatModel));
    }
    const updatedChats: ChatInterface[] = JSON.parse(
      JSON.stringify(usePortalStore.getState().chats)
    );
    const currentChat = updatedChats[currentChatIndex];
    if (!currentChat.messages) {
      currentChat.messages = [];
    }    
    const newUserMessage = {
      role: chatRole,
      content: _content,
      embeddedContent: _embeddedContent,
      command: "zap",
      context: chatContext,
      model: chatModel,
    }
    if (sticky) {
      currentChat.messages = [...currentChat.messages, newUserMessage];
      _setContent('');
      setUploadedFiles([]);
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
    if (!chatSession?.isWarning()) {
      await handleAIDynamicFunc(chatSession);
    }
  }, [
    _content,
    aiContext,
    currentChatIndex,
    messageIndex,
    chatSession,
    sticky,
    chatRole,
    chatContext,
    chatModel,
    handleSetup,
    handleUpdateCloudChat,
    handleAIDynamicFunc,
    setChats,
    setIsEdit,
    _setContent,
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

  console.log("this is warning", isWarningModalOpen)

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

  const FileSystemPopover = ({ children }) => {
    return (
      <Popover
        isOpen={isSystemModalOpen}
        onOpenChange={(open) => setIsSystemModalOpen(open)}
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
            className="w-full p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
          >
            <SystemFile handleFilesProcessed={handleFilesProcessed} setIsModalOpen={setIsSystemModalOpen} />
          </motion.div>
        </PopoverContent>
      </Popover>
    );
  };

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
      {!isSmallScreen && <CharacterCount numofCharacter={characterCount} />}
    </div>
  ), [_content, _setContent, setCharacterCount, isSmallScreen, characterCount]);

  const endContent = useMemo(() => (
    <div className="flex gap-4 justify-center items-center px-2 py-2 h-full">
      <GenerateButton isGenerating={usePortalStore.getState().generating} stop={stop} generate={handleGenerate} />
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
                {options.map((option, index) => {
                  if (option.value === "audio") {
                    return (
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
                    );
                  } else if (option.value === "system") {
                    return (
                      <FileSystemPopover key={index}>
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
                      </FileSystemPopover>
                    );
                  } else if (option.value === "video") {
                    return (
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
                    );
                  } else {
                    return (
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
                    );
                  }
                })}
              </div>
            </ScrollShadow>
          </PopoverContent>
        </Popover>
      ) : (
        <ScrollShadow orientation="horizontal" className="w-20 z-[99]">
          <div className="flex space-x-2 p-2">
            {options.map((option, index) => {
              if (option.value === "audio") {
                return (
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
                );
              } else if (option.value === "system") {
                return (
                  <FileSystemPopover key={index}>
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
                  </FileSystemPopover>
                );
              } else if (option.value === "video") {
                return (
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
                );
              } else {
                return (
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
                );
              }
            })}
          </div>
        </ScrollShadow>
      )}
    </div>
  ), [handleGenerate, stop, isOpen, isVertical, options, setFileFormat, toggleLayout, handleSwitchOpenModal, setAudioOption, setIsAudioModalOpen]);

  const FileIcon = ({ type }) => {
    switch (type) {
      case 'text':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <FileImage className="w-5 h-5 text-green-500" />;
      case 'audio':
        return <FileAudio className="w-5 h-5 text-purple-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      <div className="relative flex flex-col w-full max-w-3xl mx-auto mt-4">
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
                <Paperclip className="w-6 h-6 mr-2" />
                Uploaded Files
              </h3>
              <span className="text-sm font-medium px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
              </span>
            </div>
            <ScrollShadow className="max-h-[70vh]">
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    className="relative group overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-700"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                    <div className="relative z-20 p-4 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <FileIcon type={file.type} className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onClick={() => removeFile(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate mb-1">
                          {file.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <div className="mt-2 flex-grow">
                        {file.type === 'image' ? (
                          <div className="relative h-32 w-full overflow-hidden rounded">
                            <img
                              src={file.content}
                              alt={file.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        ) : (
                          <div className="h-32 bg-gray-100 dark:bg-gray-600 p-2 rounded overflow-hidden">
                            <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-5">
                              {file.content || `Content of ${file.name}`}
                            </p>
                          </div>
                        )}
                      </div>
                      <motion.div
                        className="absolute inset-y-12 inset-x-0 cursor-pointer bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                        animate={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <Button
                          color="primary"
                          variant="shadow"
                          size="sm"
                          className="font-medium"
                          startContent={<Eye size={16} />}
                          onClick={() => handlePreviewFile(file)}
                        >
                          Preview
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </ScrollShadow>
          </motion.div>
        )}     
        {fileFormat === "audio" && audioOption === "record" && (
          <AudioInput 
            onTranscriptionUpdate={handleTranscriptionUpdate}
            onTranscriptionComplete={handleTranscriptionComplete}
          />
        )}
        {fileFormat === "audio" && audioOption === "upload" && isAudioModalOpen && (
          <AudioUploadModal
            onFilesProcessed={handleFilesProcessed}
            isOpen={isAudioModalOpen}
            onClose={() => setIsAudioModalOpen(false)}
          />
        )}
         {fileFormat === "file" && (
          <FileUploadModal
            onFilesProcessed={handleFilesProcessed}
            isOpen={isFileModalOpen}
            onClose={() => setIsFileModalOpen(false)}
          />
        )}
        {fileFormat === "image" && (
          <ImageUploadModal
            onFilesProcessed={handleFilesProcessed}
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
          />
        )}
        <Textarea
          ref={textareaRef}
          className="m-0 w-full h-full resize-none overflow-y-hidden bg-transparent dark:bg-transparent overflow-auto"
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
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={() => {
          setIsWarningModalOpen(false);
          chatSession?.handleCancel();
        }}
        onAutoStrip={handleAutoStrip}
        onAutoSummarize={handleAutoSummarize}
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
  const generating = usePortalStore((state) => state.generating);
  const advancedMode = usePortalStore((state) => state.advancedMode);

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
            onClick={sticky ? handleGenerate : () => setIsModalOpen(true)}
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
      {sticky && advancedMode && !isMediumScreen && (
        <TokenCount />
      )}
    </motion.div>
  );
});

export default ChatView;

