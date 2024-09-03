"use client"
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useMyspaceContext } from '@/context/myspace-context-provider'
import { usePortalContextHook } from '@/context/portal-context-provider'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from "framer-motion";
import CodeProjectConfig from "../_components/code-project-config"
import SettingsButton from '../_components/settings-button'
import SettingsModal from '../_components/settings-modal'
import {
  Button,
  Card,
  CardContent,
  CardBody,
  Tabs, 
  Tab,
  Input,
  Textarea,
  Tooltip,
  ScrollShadow,
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  useDisclosure, 
  Listbox, 
  ListboxItem,
  cn,
} from "@nextui-org/react";
import { FaMicrophone, FaUpload } from 'react-icons/fa';
import CrazySpinnerIcon from "@/icons/CrazySpinnerIcon";
import { AudioUploadModal } from "../_components/audio-upload-modal";
import { FileUploadModal } from "../_components/file-upload-modal";
import { ImageUploadModal } from "../_components/image-upload-modal";
import UnreleasePopover from "@/components/apps/document/chatbot/unrelease-popover";
import { X, ArrowUp, Mic, Paperclip, Image, Video, Music, AlignHorizontalSpaceAround, AlignVerticalSpaceAround, RotateCw, Send, StopCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { createFlaskProjectStructure, createNodeProjectStructure, createAngularProjectStructure, createReactProjectStructure, createNextJsProjectStructure } from "@/constants/code";

interface TestResult {
  passed: boolean;
  output: string;
}

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

export default function ProjectHomePage() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  const [isGenerating, setIsGenerating] = React.useState(false)
  const { projectStructure, setProjectStructure, currentComponent, setCurrentComponent } = usePortalContextHook();
  const {
    isLeftSidebarOpened,
    setIsLeftSidebarOpened,
    leftSidebarType,
    setLeftSidebarType,
    setLeftSidebarWidth,
  } = useMyspaceContext();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme } = useTheme();
   const MAX_WORDS = 255;
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
  const createProject = useMutation(api.codes.createProject);

  const [projectConfigs, setProjectConfigs] = useState({
    general: {
      projectName: '',
      projectType: 'web',
      version: '1.0.0',
      description: '',
    },
    development: {
      language: 'JavaScript',
      framework: 'React',
      buildTool: 'Webpack',
      packageManager: 'npm',
    },
    testing: {
      framework: 'Jest',
      e2eFramework: 'Cypress',
    },
    database: {
      type: 'SQL',
      name: 'PostgreSQL',
      orm: 'Sequelize',
    },
    deployment: {
      platform: 'AWS',
      cicdTool: 'GitHub Actions',
      containerization: 'Docker',
    },
    security: {
      authentication: 'JWT',
      authorization: 'RBAC',
      dataEncryption: true,
    },
    performance: {
      caching: 'Redis',
      cdn: 'Cloudflare',
    },
    metadata: {
      developers: '',
      creationDate: new Date().toISOString().split('T')[0],
      lastModifiedDate: new Date().toISOString().split('T')[0],
      status: 'Planning',
      license: 'MIT',
    },
  });

  const onCreateProject = async (projectStructure: ProjectStructure) => {
    const projectInfo = {
      projectId: uuidv4(), 
      projectName: projectConfigs.general.projectName,
      version: projectConfigs.general.version,
      description: projectConfigs.general.description,
      development: {
        language: projectConfigs.development.language,
        framework: projectConfigs.development.framework,
        buildTool: projectConfigs.development.buildTool,
        packageManager: projectConfigs.development.packageManager,
      },
      testing: {
        framework: projectConfigs.testing.framework,
        e2eFramework: projectConfigs.testing.e2eFramework,
      },
      database: {
        type: projectConfigs.database.type,
        name: projectConfigs.database.name,
        orm: projectConfigs.database.orm,
      },
      deployment: {
        platform: projectConfigs.deployment.platform,
        cicdTool: projectConfigs.deployment.cicdTool,
        containerization: projectConfigs.deployment.containerization,
      },
      security: {
        authentication: projectConfigs.security.authentication,
        authorization: projectConfigs.security.authorization,
        dataEncryption: projectConfigs.security.dataEncryption,
      },
      performance: {
        caching: projectConfigs.performance.caching,
        cdn: projectConfigs.performance.cdn,
      },
      structure: projectStructure,
      metadata: {
        developers: projectConfigs.metadata.developers,
        creationDate: projectConfigs.metadata.creationDate,
        lastModifiedDate: projectConfigs.metadata.lastModifiedDate,
        status: projectConfigs.metadata.status,
        license: projectConfigs.metadata.license,
      },
    };

    const promise = createProject({ projectInfo })
      .then((projectId) => {
        router.prefetch(`/myspace/apps/portal/code/${projectId}`);
        router.push(`/myspace/apps/portal/code/${projectId}`);
        return projectId;
      });

    toast.promise(promise, {
      loading: "Creating a new project...",
      success: "New project created!",
      error: "Failed to create a new project."
    });

    return promise;
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const generateProjectSchema = (framework: string) => {
    switch (framework.toLowerCase()) {
      case "react":
        return createReactProjectStructure();
      case "nextjs":
        return createNextJsProjectStructure();
      case "angular":
        return createAngularProjectStructure();
      case "node":
        return createNodeProjectStructure();
      case "flask":
        return createFlaskProjectStructure();
      default:
        throw new Error("Unsupported framework selected");
    }
  };

  const generateProject = async () => {
    setIsGenerating(true);
    try {
      const projectInputs = {
        input,
        output: generateProjectSchema(projectConfigs.development.framework),
        configs: projectConfigs,
        existingStructure: {}
      };
      const response = await fetch('/api/generate_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectInputs),
      });
      const data: ProjectStructure = await response.json();
      setProjectStructure(data);
      localStorage.setItem('projectStructure', JSON.stringify(data));
      await onCreateProject(data);
    } catch (error) {
      console.error('Error generating project structure:', error);
      toast.error('Failed to generate project structure');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSuggestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate_suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectConfigs }),
      })
      const data: { suggestion: string } = await response.json()
      setSuggestion(data.suggestion)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setIsGenerating(false);
    }
  }

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMoveResize);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const toggleViewportExpansion = () => {
    setIsViewportExpanded(!isViewportExpanded);
  };
  
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
    const isValid = isInputValid(value);
    _setIsInputValid(isValid);
    if (isValid) {
      setInput(value);
    } else {
      toast.error("Please enter a valid input.");
    }
  }, [setInput, _setIsInputValid]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await generateProject();
    }
  };

  const stop = () => {}

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
      <GenerateButton isGenerating={isGenerating} stop={stop} generate={generateProject} />
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
    <div className={`flex flex-col py-14 h-screen w-full ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Code Generator</h1>
        <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      </div>
      <div className="flex-1 flex flex-col p-4 w-full h-full">
       <CodeProjectConfig 
          projectConfigs={projectConfigs} 
          setProjectConfigs={setProjectConfigs}
          generateSuggestions={generateSuggestions}
          isGenerating={isGenerating} 
        />
        <Card className="mb-4 h-full min-h-56">
          <CardBody className="h-full">
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
                value={input}
                onChange={(e) => {
                  handleInputChange(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                required
                error={!isInputValid(input) && input !== ''}
                helperText={!isInputValid(input) && input !== '' ? `input exceeds ${MAX_WORDS} words limit` : ''}
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
            <Button 
              onClick={generateProject}
              isLoading={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Code'}
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

