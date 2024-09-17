"use client"
import React, { memo, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { toast } from "sonner";
import CharacterCount from '@/components/apps/chatbot/character-count';
import CommandPrompt from '@/components/apps/chatbot/command-prompt';
import { AudioUploadModal } from "@/components/apps/chatbot/audio-upload-modal";
import { FileUploadModal } from "@/components/apps/chatbot/file-upload-modal";
import { ImageUploadModal } from "@/components/apps/chatbot/image-upload-modal";
import { Zap, X, ArrowUp, Mic, Paperclip, Image, Video, Music, AlignHorizontalSpaceAround, AlignVerticalSpaceAround, RotateCw, Send, StopCircle, RefreshCw, FileText, FileImage, FileAudio, ListTree, Eye } from 'lucide-react';
import { cn, Input, Textarea, Tooltip, ScrollShadow, Button, Popover, PopoverTrigger, PopoverContent, useDisclosure, Listbox, ListboxItem, Progress, Card, CardHeader, CardBody, CardFooter,  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from 'framer-motion';
import { FiSave, FiX, FiZap } from 'react-icons/fi';
import { FaMicrophone, FaUpload } from 'react-icons/fa';
import UnreleasePopover from "@/components/apps/chatbot/unrelease-popover";
import { FileInterface } from "@/types/chat";
import { useModelStore } from '@/stores/features/models/store';
import { usePortalStore } from '@/stores/features/apps/portal/store';
import { useGeneralContext } from "@/context/general-context-provider";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { usePortalContext } from "@/context/portal-context-provider";
import WarningModal from "@/components/apps/chatbot/warning-modal";
import { ProjectSettings } from '@/types/code';
import { MessageInterface } from '@/types/chat';
import { generateStructurePrompt, generateProjectSchema } from '@/utils/codeUtils';
import { useProjectGenerator } from "@/hooks/use-project-generator";

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

interface ProjectPromptProps {
  projectConfigs: ProjectSettings;
  generating: boolean;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectPrompt: React.FC<ProjectPromptProps> = ({ 
  projectConfigs, 
  generating,
  setGenerating,
}) => {  
  const setChatRole = usePortalStore((state) => state.setChatRole);
  const setChatModel = usePortalStore((state) => state.setChatModel);
  const setChatContext = usePortalStore((state) => state.setChatContext);
  const countTotalTokens = useModelStore((state) => state.countTotalTokens);
  const { setAiContext, setInputType, setOutputType, setIsSystemModel } = useGeneralContext();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const MAX_WORDS = 4096;
  const [_isInputValid, _setIsInputValid] = useState<boolean>(true);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [audioOption, setAudioOption] = useState<string | null>(null);
  const [fileFormat, setFileFormat] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [isVertical, setIsVertical] = useState<boolean>(true);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { handleSubmit, handleStop } = useProjectGenerator({ generating: isGenerating, setGenerating: setIsGenerating, error: error, setError: setError });

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSetup = useCallback(() => {
    setIsSystemModel(false);
    setChatRole("user");
    setAiContext("basic");
    setChatContext("general");
    setInputType("text-only");
    setOutputType("text");
  }, [setIsSystemModel, setChatRole, setAiContext, setChatContext, setInputType, setOutputType]);

  const generateProject = useCallback(async () => {
    handleSetup();
    if (isGenerating || !projectConfigs || !input) {
      console.warn("Project configs or input is missing, or generating is already in progress.");
      return;
    }
    setIsGenerating(true);
    try {
      const output = generateProjectSchema(projectConfigs.development.framework);
      const existingStructure = {};
      const prompt = generateStructurePrompt(input, output, projectConfigs, existingStructure);
      await handleSubmit(prompt, output, projectConfigs);
    } catch (error) {
      console.error("Error generating project:", error);
      toast.error("Failed to generate project. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, input, projectConfigs, handleSubmit]);


  const handleAudioUpload = () => {
    setIsAudioModalOpen(true);
  };

  const handleImageProcessed = (result: string) => { 
    setInput(result);
    setIsImageModalOpen(false);
  };

  const handleImageUpload = () => {
    setIsImageModalOpen(true);
  };

  const handleFileProcessed = (result: string) => { 
    setInput(result);
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
    setInput(finalTranscription);
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

  const isInputValid = (text) => {
    if(!text) return null;
    return wordCount(text) <= MAX_WORDS;
  };

  const toggleLayout = () => {
    setIsVertical(!isVertical);
    setIsOpen(false);
  };

  const handleInputChange = useCallback((value) => {
    setInput(value);
  }, [setInput]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      generateProject();
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
      {input && (
        <button 
          aria-label="cancel"
          className="absolute right-32 top-2 flex items-center justify-center rounded-full w-4 h-4 bg-slate-200 hover:bg-slate-400"
          onClick={() => {
            setInput('');
            _setIsInputValid(true);

          }}
          type="button"
        >
          <X className="w-3 h-3 text-gray-800 cursor-pointer" />
        </button>
      )}
      <div className="absolute right-32 bottom-1 flex items-center">
        <span className={`text-tiny ${isInputValid(input) ? 'text-default-400' : 'text-danger'}`}>
          {wordCount(input)}/{MAX_WORDS}
        </span>
      </div>
    </div>
  ), [input, setInput, wordCount, isInputValid, _setIsInputValid]);

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
      <GenerateButton isGenerating={isGenerating} stop={handleStop} generate={generateProject} />
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
  ), [isGenerating, stop, isOpen, isVertical, options, setFileFormat]);

  return (
    <Card className="w-full max-w-5xl mx-auto mt-8 overflow-visible">
      <CardHeader className="flex flex-col items-start pb-0 pt-6 px-6">
        <h2 className="text-3xl font-bold text-primary-500 mb-2 flex items-center">
          <Zap className="mr-2" size={32} />
          Project Generator
        </h2>
        <p className="text-default-500">Describe your project, and let AI work its magic!</p>
      </CardHeader>
      <CardBody className="overflow-visible py-6">
        <motion.div 
          className="flex mb-4 bg-default-100 rounded-lg p-1"
          layout
        >
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
            description="Enter a concise description of what you want AI to generate."
            value={input}
            onChange={(e) => {
              handleInputChange(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            required
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
        </motion.div>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <Progress
              size="sm"
              isIndeterminate
              color="primary"
              className="max-w-md mx-auto"
            />
            <p className="text-center text-default-500 mt-2">Generating your project...</p>
          </motion.div>
        )}
      </CardBody>
    </Card>
  );
};

export default memo(ProjectPrompt);