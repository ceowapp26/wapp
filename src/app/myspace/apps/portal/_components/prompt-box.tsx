import React, { memo, useEffect, useState, useCallback, useMemo, useRef, useImperativeHandle } from 'react';
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import { usePortalStore } from '@/stores/features/apps/portal/store';
import CharacterCount from '@/components/apps/chatbot/character-count';
import CommandPrompt from '@/components/apps/chatbot/command-prompt';
import { AudioUploadModal } from "@/components/apps/chatbot/audio-upload-modal";
import { FileUploadModal } from "@/components/apps/chatbot/file-upload-modal";
import { ImageUploadModal } from "@/components/apps/chatbot/image-upload-modal";
import { X, ArrowUp, Mic, Paperclip, Image, Video, Music, AlignHorizontalSpaceAround, AlignVerticalSpaceAround, RotateCw, Send, StopCircle, RefreshCw, FileText, FileImage, FileAudio, ListTree, Eye } from 'lucide-react';
import { cn, Input, Textarea, Tooltip, ScrollShadow, Button, Popover, PopoverTrigger, PopoverContent, useDisclosure, Listbox, ListboxItem, Progress, Card, CardBody, CardFooter,  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiX, FiZap } from 'react-icons/fi';
import { FaMicrophone, FaUpload } from 'react-icons/fa';
import UnreleasePopover from "@/components/apps/chatbot/unrelease-popover";
import { FileInterface } from "@/types/chat";
import { useGeneralContext } from "@/context/general-context-provider";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { usePortalContext } from "@/context/portal-context-provider";
import SystemFile from "@/components/apps/chatbot/system-file";
import WarningModal from "@/components/apps/chatbot/warning-modal";
import { ChatSession } from "@/utils/aiUtils";
import { useEditorSubmit } from "@/hooks/use-editor-submit";

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


interface PromptBoxProps {
  content: string;
  generating: boolean;
  setGenerating?: React.Dispatch<React.SetStateAction<boolean>>;
  error?: string;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  setCurrentComponent?: React.Dispatch<React.SetStateAction<string>>;
  regenerateRef?: React.Ref<any>; 
}

const PromptBox: React.FC<PromptBoxProps> = ({
  content,
  generating,
  setGenerating,
  error,
  setError,
  setCurrentCodeFile,
  setCurrentEmbeddedFile,
  setCurrentComponent,
  regenerateRef,
}) => {
 const chatRole = usePortalStore((state) => state.chatRole);
  const setChatRole = usePortalStore((state) => state.setChatRole);
  const chatContext = usePortalStore((state) => state.chatContext);
  const chatModel = usePortalStore((state) => state.chatModel);
  const setChatModel = usePortalStore((state) => state.setChatModel);
  const setChatContext = usePortalStore((state) => state.setChatContext);
  const { chatHistory, setChatHistory, editorChatSession, setEditorChatSession } = usePortalContext();
  const { aiContext, setAiContext, setAiModel, setInputType, setOutputType, setIsSystemModel } = useGeneralContext();
  const [_content, _setContent] = useState<string>(content);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isVertical, setIsVertical] = useState(true);
  const [transcription, setTranscription] = useState('');
  const [audioOption, setAudioOption] = useState<string | null>(null);
  const [fileFormat, setFileFormat] = useState<string | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileInterface[]>([]);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isFunctionCalled, setIsFunctionCalled] = useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatModel) {
      const newChatSession = new ChatSession(chatModel);
      chatHistory.forEach(message => {
        const { role, content, embeddedContent } = message;
        newChatSession.addMessage({ role, content, embeddedContent });
      });
      setEditorChatSession(newChatSession);
    }
  }, [chatModel, chatHistory]);

  useEffect(() => {
    if (editorChatSession?.isWarning()) {
      setIsWarningModalOpen(true);
    } else {
      setIsWarningModalOpen(false);
    }
  }, [editorChatSession]);

  const { handleSubmit, handleStop } = useEditorSubmit({ generating: generating, setGenerating: setGenerating, error: error, setError: setError });

  const handleFilesProcessed = (newFiles: FileInterface[]) => {
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreviewFile = (file: FileInterface) => {
    setCurrentComponent?.(null);
    setCurrentEmbeddedFile?.(file);
  };

  const handleSwitchOpenModal = (option: "image" | "file" | "audio" | "system") => {
    switch (option) {
      case "image":
        setIsImageModalOpen(true);
        break;
      case "file":
        setIsFileModalOpen(true);
        break;
      case "system":
        setIsSystemModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleTranscriptionUpdate = (newTranscription: string) => {
    setTranscription(newTranscription);
  };

  const handleTranscriptionComplete = (finalTranscription: string) => {
    _setContent(finalTranscription);
    setFileFormat(null);
    setIsAudioModalOpen(false);
  };

  const updateChatWithSession = () => {
    setIsFunctionCalled(false);
  };

  const handleAutoStrip = useCallback(() => {
    if (!editorChatSession) return;
    editorChatSession.handleAutoStrip();
    updateChatWithSession();    
    handleGenerate();
  }, [editorChatSession, updateChatWithSession]);

  const handleAutoSummarize = useCallback(() => {
    if (!editorChatSession) return;
    editorChatSession.handleAutoSummarize();
    updateChatWithSession();
    handleGenerate();
  }, [editorChatSession, updateChatWithSession]);

  const options = [
    { icon: <Paperclip />, label: 'Upload File', value: "file" },
    { icon: <Mic />, label: 'Audio', value: "audio" },
    { icon: <Image />, label: 'Image', value: "image" },
    { icon: <Video />, label: 'Video', value: "video" },
    { icon: <ListTree />, label: 'Choose from system', value: "system" },
    { icon: isVertical ? <AlignVerticalSpaceAround /> : <AlignHorizontalSpaceAround />, label: 'Switch Layout' },
  ];

  const toggleLayout = () => {
    setIsVertical(!isVertical);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleSetup = useCallback(() => {
    setIsSystemModel(false);
    setChatRole("user");
    setAiContext("basic");
    setChatContext("general");
    setInputType("text-only");
    setOutputType("text");
  }, [setIsSystemModel, setChatRole, setAiContext, setChatContext, setInputType, setOutputType, chatModel]);

  const handleGenerate = useCallback(async () => {
    handleSetup();
    if (_content === '' && uploadedFiles.length === 0 || _content.trim() === '' && uploadedFiles.length === 0 || generating) return;
    setIsFunctionCalled(true);
    const _embeddedContent: FileInterface[] = uploadedFiles.map(file => ({
      name: file.name,
      content: file.content,
      type: file.type,
      size: file.size
    }));

    if (!editorChatSession) {
      setEditorChatSession(new ChatSession(chatModel));
    }
    const newUserMessage = {
      role: "user",
      content: _content,
      embeddedContent: _embeddedContent,
      command: "zap",
      context: chatContext,
      model: chatModel,
    };
    setChatHistory(prev => [...prev, newUserMessage]);
    if (!editorChatSession?.isWarning()) {
      const result = await handleSubmit();
      if (result) {
        updateChatWithSession();
      }
    }
  }, [_content, uploadedFiles, generating, editorChatSession, chatModel, chatContext, handleSetup, handleSubmit, setChatHistory]);

    const handleRegenerate = useCallback(async () => {
    if (chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (lastMessage.role === "assistant") {
        setChatHistory(prev => prev.slice(0, -1));
      }
    }
    await handleSubmit();
  }, [chatHistory, handleSubmit, setChatHistory]);

  useImperativeHandle(regenerateRef, () => handleRegenerate);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [_content]);

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
      <CharacterCount numofCharacter={characterCount} />
    </div>
  ), [_content, _setContent, setCharacterCount, characterCount]);

  const endContent = useMemo(() => (
    <div className="flex gap-4 justify-center items-center px-2 py-2 h-full">
      <GenerateButton isGenerating={generating} stop={handleStop} generate={handleGenerate} />
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
          placeholder={"Ask AI anything"}
          onKeyDown={handleKeyDown}
          minRows={1}
          maxRows={4}
          variant="flat"
        />
      </div>
      <WarningModal
        isFunctionCalled={isFunctionCalled}
        isOpen={isWarningModalOpen}
        onClose={() => {
          setIsWarningModalOpen(false);
          editorChatSession?.handleCancel();
        }}
        onAutoStrip={handleAutoStrip}
        onAutoSummarize={handleAutoSummarize}
      />
    </>
  );
}

export default PromptBox;