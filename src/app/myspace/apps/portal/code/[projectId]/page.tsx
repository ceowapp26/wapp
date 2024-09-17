"use client"
import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense, memo } from 'react';
import { useMyspaceContext } from '@/context/myspace-context-provider'
import { usePortalContext } from '@/context/portal-context-provider'
import { usePortalStore } from '@/stores/features/apps/portal/store'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from "framer-motion";
import CodeProjectConfig from "../../_components/code-project-config"
import SettingsButton from '../../_components/settings-button'
import SettingsModal from '../../_components/settings-modal'
import {
  Button,
  Card,
  CardHeader,
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
import UnreleasePopover from "@/components/apps/chatbot/unrelease-popover";
import { Cover } from "@/components/apps/document/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { X, ArrowUp, Mic, Paperclip, Image, Video, Music, AlignHorizontalSpaceAround, AlignVerticalSpaceAround, RotateCw, Send, StopCircle, ChevronLeft, ChevronRight, Loader2, Code, Eye, Settings } from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { FileInterface } from "@/types/chat";
import { createFlaskProjectStructure, createNodeProjectStructure, createAngularProjectStructure, createReactProjectStructure, createNextJsProjectStructure } from "@/constants/code";
import { ProjectStructure, CodeFile } from '@/types/code';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { GradientLoadingCircle } from "@/components/gradient-loading-circle";
import FileContentPreview from "../../_components/file-content-preview";
import { 
  detectFramework,  
  processReactCode, 
  processVueCode, 
  processGoCode, 
  processPythonCode,
  getFileName,
  getTestFileName,  
} from "@/utils/codeUtils";

const ChatContent = dynamic(() => import("@/components/apps/chatbot/chat-content"), {
  suspense: true,
  loading: () => <GradientLoadingCircle size={70} thickness={5} />,
});

const ComponentEditor = dynamic(() => import("../../_components/component-editor"), {
  suspense: true,
  loading: () => <GradientLoadingCircle size={70} thickness={5} />,
});

interface TestResult {
  passed: boolean;
  output: string;
}

const MIN_WIDTH = 300;

const TopToolbar = ({ isSettingsOpen, setIsSettingsOpen, settings, handleSettingChange }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-28 left-0 right-0 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-[40]"
    >
      <motion.h1 className="text-2xl font-bold">Code Generator</motion.h1>
      <Button auto light icon={<Settings size={20} />} onClick={() => setIsSettingsOpen(true)}>Settings</Button>
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100000] flex items-center justify-center bg-black bg-opacity-50"
          >
            <Card className="w-full max-w-md">
              <CardBody>
                <h2 className="text-xl font-bold mb-4">Settings</h2>
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between mb-2">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <Button auto color={value ? "primary" : "default"} onClick={() => handleSettingChange(key, !value)}>
                      {value ? 'On' : 'Off'}
                    </Button>
                  </div>
                ))}
                <Button auto color="danger" className="mt-4" onClick={() => setIsSettingsOpen(false)}>Close</Button>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ResizableSplitView = ({ theme, children }) => {
  const [leftWidth, setLeftWidth] = useState('50%');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startLeftWidth, setStartLeftWidth] = useState(0);
  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const dividerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartLeftWidth(leftPanelRef.current.offsetWidth);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.clientX - startX;
    const newLeftWidth = Math.max(MIN_WIDTH, Math.min(startLeftWidth + deltaX, containerWidth - MIN_WIDTH));
    
    setLeftWidth(`${(newLeftWidth / containerWidth) * 100}%`);
  }, [isDragging, startX, startLeftWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col min-h-screen h-full w-full overflow-hidden ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <div className="flex h-full relative">
        <div 
          ref={leftPanelRef}
          style={{ width: leftWidth, minWidth: MIN_WIDTH }} 
          layout
        >
          {children[0]}
        </div>
        <div
          ref={dividerRef}
          className={`w-1 cursor-col-resize ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} hover:bg-blue-500 transition-colors`}
          onMouseDown={handleMouseDown}
        />
        <div 
          style={{ width: `calc(100% - ${leftWidth})`, minWidth: MIN_WIDTH }} 
          layout
        >
          {children[1]}
        </div>
      </div>
    </motion.div>
  );
};

const renderComponent = (framework: string | null | undefined, code: string, theme: string) => {
  if (!framework) {
    return <div>No framework specified.</div>;
  }
  switch (framework.toLowerCase()) {
    case 'react':
      return (
        <LiveProvider code={processReactCode(code).code} scope={{}} noInline>
          <div className="grid grid-cols-2 gap-4">
            <LiveEditor className={`font-mono ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`} />
            <LivePreview className={`p-4 border rounded ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`} />
            <LiveError className="text-red-500 bg-red-100 p-2 rounded mt-2" />
          </div>
        </LiveProvider>
      );
    case 'angular':
      // Angular-specific rendering logic
      return <div>Angular component preview is not supported yet.</div>;
    case 'vue':
      // Vue-specific rendering logic
      return <div>Vue component preview is not supported yet.</div>;
    case 'django':
      // Django-specific rendering logic
      return <div>Django component preview is not supported yet.</div>;
    case 'spring':
      // Spring-specific rendering logic
      return <div>Spring component preview is not supported yet.</div>;
    case 'asp.net':
      // ASP.NET-specific rendering logic
      return <div>ASP.NET component preview is not supported yet.</div>;
    case 'nextjs':
      return (
        <LiveProvider code={processReactCode(code).code} scope={{}} noInline>
          <div className="grid grid-cols-2 gap-4">
            <LiveEditor className={`font-mono ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`} />
            <LivePreview className={`p-4 border rounded ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`} />
            <LiveError className="text-red-500 bg-red-100 p-2 rounded mt-2" />
          </div>
        </LiveProvider>
      );
    default:
      return <div>Framework not supported or not recognized.</div>;
  }
};

const ProjectSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
  >
    <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
    <div className="space-y-4 mt-6">
      <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
    </div>
  </motion.div>
);

const ProjectNotFound = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full h-screen flex items-center max-w-4xl mx-auto mt-10 p-6"
  >
    <Alert variant="destructive">
      <AlertTitle>Project Not Found</AlertTitle>
      <AlertDescription>
        We couldn't find the project you're looking for. It may have been removed or you might not have the necessary permissions.
      </AlertDescription>
    </Alert>
  </motion.div>
);

const RenderContent = ({
  settings,
  isSettingsOpen,
  setIsSettingsOpen,
  handleSettingChange,
  theme,
  insertedContent,
  isInsertedContent,
  setIsInsertedContent,
  setInsertedContent,
  handleOnInsert,
  handleReplaceCode,
  handleInsertAboveCode,
  handleInsertBelowCode,
  handleInsertLeftCode,
  handleInsertRightCode,
  currentComponent,
  setCurrentComponent,
  currentCodeFile,
  setCurrentCodeFile,
  currentEmbeddedFile,
  setCurrentEmbeddedFile,
  componentName,
  componentContent,
  componentTest,
  updateCode,
  runUnitTests,
  regenerateComponent,
  testResults,
  runIntegrationTests,
  integrationTestResults,
  activeTab,
  setActiveTab,
  showFilePreview,
  showComponentEditor,
  detectFramework,
}) => {
  const toolbar = (
    <TopToolbar 
      isSettingsOpen={isSettingsOpen}
      setIsSettingsOpen={setIsSettingsOpen} 
      settings={settings} 
      handleSettingChange={handleSettingChange} 
    />
  );

  if (settings.showChatbot && settings.showEditor) {
    return (
      <div>
        {toolbar}
        <ResizableSplitView theme={theme}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="h-full">
            <Card className="pt-10 h-screen flex flex-col overflow-y-auto">
              <CardBody>
                <ChatContent 
                  insertedContent={insertedContent}
                  isInsertedContent={isInsertedContent}
                  setIsInsertedContent={setIsInsertedContent}
                  setInsertedContent={setInsertedContent}
                  handleReplaceCode={handleReplaceCode}
                  handleInsertAboveCode={handleInsertAboveCode}
                  handleInsertBelowCode={handleInsertBelowCode}
                  handleInsertLeftCode={handleInsertLeftCode}
                  handleInsertRightCode={handleInsertRightCode}
                  setCurrentComponent={setCurrentComponent} 
                  currentCodeFile={currentCodeFile}
                  setCurrentCodeFile={setCurrentCodeFile}
                  currentEmbeddedFile={currentEmbeddedFile}
                  setCurrentEmbeddedFile={setCurrentEmbeddedFile}
                  isCode
                />
              </CardBody>
            </Card>
          </motion.div>
          <div className="relative h-full w-full">
            {showFilePreview && (
              <div className="absolute top-0 left-0 w-full h-full z-30">
                <FileContentPreview file={currentEmbeddedFile} />
              </div>
            )}
            {showComponentEditor && (
              <div className="absolute top-32 left-0 w-full h-full z-20">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="h-full">
                  <Tabs selectedKey={activeTab} onSelectionChange={setActiveTab} className="p-2">
                    <Tab key="editor" title={<div className="flex items-center space-x-2"><Code size={18} /><span>Editor</span></div>}>
                      <AnimatePresence mode="wait">
                        <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                          <ComponentEditor
                            componentName={componentName}
                            code={componentContent}
                            test={componentTest}
                            updateCode={updateCode}
                            onRunTests={() => runUnitTests(currentComponent)}
                            onRegenerate={() => regenerateComponent(currentComponent)}
                            testResults={testResults[currentComponent]}
                            onRunIntegrationTests={runIntegrationTests}
                            integrationTestResults={integrationTestResults}
                            currentComponent={currentComponent}
                            setCurrentComponent={setCurrentComponent} 
                            currentCodeFile={currentCodeFile}
                            setCurrentCodeFile={setCurrentCodeFile}
                            currentEmbeddedFile={currentEmbeddedFile}
                            setCurrentEmbeddedFile={setCurrentEmbeddedFile}
                            handleReplaceCode={handleReplaceCode}
                            handleInsertAboveCode={handleInsertAboveCode}
                            handleInsertBelowCode={handleInsertBelowCode}
                            handleInsertLeftCode={handleInsertLeftCode}
                            handleInsertRightCode={handleInsertRightCode}
                            handleOnInsert={handleOnInsert}
                            isShowChatbot={settings.showChatbot}
                            isShowEditor={settings.showEditor}
                          />
                        </motion.div>
                      </AnimatePresence>
                    </Tab>
                    <Tab key="preview" title={<div className="flex items-center space-x-2"><Eye size={18} /><span>Preview</span></div>}>
                      <AnimatePresence mode="wait">
                        {settings.showComponentPreview && (
                          <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                            {renderComponent(detectFramework(componentContent), componentContent, theme)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Tab>
                  </Tabs>
                </motion.div>
              </div>
            )}
          </div>
        </ResizableSplitView>
      </div>
    );
  } else if (settings.showChatbot || !settings.showEditor) {
    return (
      <div>
        {toolbar}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="h-full">
          <Card className="py-10 h-full">
            <CardBody className="overflow-auto">
              <ChatContent 
                insertedContent={insertedContent}
                isInsertedContent={isInsertedContent}
                setIsInsertedContent={setIsInsertedContent}
                setInsertedContent={setInsertedContent}
                handleReplaceCode={handleReplaceCode}
                handleInsertAboveCode={handleInsertAboveCode}
                handleInsertBelowCode={handleInsertBelowCode}
                handleInsertLeftCode={handleInsertLeftCode}
                handleInsertRightCode={handleInsertRightCode}
                setCurrentComponent={setCurrentComponent} 
                currentCodeFile={currentCodeFile}
                setCurrentCodeFile={setCurrentCodeFile}
                currentEmbeddedFile={currentEmbeddedFile}
                setCurrentEmbeddedFile={setCurrentEmbeddedFile}
                isCode
              />
            </CardBody>
          </Card>
        </motion.div>
      </div>
    );
  } else if (settings.showEditor || !settings.showChatbot) {
    return (
      <div>
        {toolbar}
        <div className="relative h-full w-full">
          {showFilePreview && (
            <div className="absolute top-0 left-0 w-full h-full z-30">
              <FileContentPreview file={currentEmbeddedFile} />
            </div>
          )}
          {showComponentEditor && (
            <div className="absolute top-32 left-0 w-full h-full z-20">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="h-full">
                <Tabs selectedKey={activeTab} onSelectionChange={setActiveTab} className="p-2">
                  <Tab key="editor" title={<div className="flex items-center space-x-2"><Code size={18} /><span>Editor</span></div>}>
                    <AnimatePresence mode="wait">
                      <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        <ComponentEditor
                          componentName={componentName}
                          code={componentContent}
                          test={componentTest}
                          updateCode={updateCode}
                          onRunTests={() => runUnitTests(currentComponent)}
                          onRegenerate={() => regenerateComponent(currentComponent)}
                          testResults={testResults[currentComponent]}
                          onRunIntegrationTests={runIntegrationTests}
                          integrationTestResults={integrationTestResults}
                          currentComponent={currentComponent}
                          setCurrentComponent={setCurrentComponent} 
                          currentCodeFile={currentCodeFile}
                          setCurrentCodeFile={setCurrentCodeFile}
                          currentEmbeddedFile={currentEmbeddedFile}
                          setCurrentEmbeddedFile={setCurrentEmbeddedFile}                          
                          handleReplaceCode={handleReplaceCode}
                          handleInsertAboveCode={handleInsertAboveCode}
                          handleInsertBelowCode={handleInsertBelowCode}
                          handleInsertLeftCode={handleInsertLeftCode}
                          handleInsertRightCode={handleInsertRightCode}
                          handleOnInsert={handleOnInsert}
                          isShowChatbot={settings.showChatbot}
                          isShowEditor={settings.showEditor}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </Tab>
                  <Tab key="preview" title={<div className="flex items-center space-x-2"><Eye size={18} /><span>Preview</span></div>}>
                    <AnimatePresence mode="wait">
                      {settings.showComponentPreview && (
                        <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                          {renderComponent(detectFramework(componentContent), componentContent, theme)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Tab>
                </Tabs>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {toolbar}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-6"
      >
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold">Select an option to get started!</p>
          <motion.div
            className="mt-4"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <svg
              className="w-16 h-16 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path d="M12 6v6l4 2" strokeWidth="2" />
            </svg>
          </motion.div>
          <motion.p
            className="mt-2 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Your code journey starts here!
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

interface ProjectIdPageProps {
  params: {
    projectId: Id<"codes">;
  };
};

const ProjectPage = ({
  params
}: ProjectIdPageProps) => {
  const currentUser = useQuery(api.users.getCurrentUser);
  const [integrationTestResults, setIntegrationTestResults] = useState<TestResult | null>(null)
  const [testResults, setTestResults] = React.useState<Record<string, TestResult>>({})
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [scope, setScope] = React.useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [suggestion, setSuggestion] = React.useState('')
  const [currentCodeFile, setCurrentCodeFile] = useState<CodeFile>(undefined)
  const [currentEmbeddedFile, setCurrentEmbeddedFile] = useState<FileInterface>(undefined)
  const [insertedContent, setInsertedContent] = useState<string>("")
  const [isInsertedContent, setIsInsertedContent] = useState<FileInterface>(undefined)
  const { currentComponent, setCurrentComponent, currentFileContent, setCurrentFileContent, activeProject, setActiveProject } = usePortalContext();
  const {
    isLeftSidebarOpened,
    setIsLeftSidebarOpened,
    leftSidebarType,
    setLeftSidebarType,
    setLeftSidebarWidth,
  } = useMyspaceContext();
  const [settings, setSettings] = useState({
    showChatbot: true,
    showEditor: true,
    showComponentEditor: true,
    showComponentPreview: true,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const { theme } = useTheme();
  const createProject = useMutation(api.codes.createProject);
  const updateProject = useMutation(api.codes.updateProject);

  const project = useQuery(api.codes.getProjectById, {
    projectId: params.projectId
  });

  useEffect(() => {
    if (!activeProject && params.projectId) {
      setActiveProject(params.projectId)
    }
  }, [activeProject, params]);

  const projectStructure = useMemo(() => 
    project && project.structure || {},
    [project]
  );

  const showComponentEditor = useMemo(() => 
    settings.showComponentEditor && (currentComponent || usePortalStore.getState().codeGenerator || currentCodeFile),
  [settings.showComponentEditor, currentComponent, currentCodeFile]);

  const showFilePreview = useMemo(() => 
    (!currentComponent && currentEmbeddedFile),
  [currentComponent, currentEmbeddedFile]);

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
      await onCreateProject(data);
    } catch (error) {
      console.error('Error generating project structure:', error);
      toast.error('Failed to generate project structure');
    } finally {
      setIsGenerating(false);
    }
  };

  const runUnitTests = async (componentPath: string) => {
    setIsGenerating(true)
    try {
      const segments = componentPath.split('/');
      const fileName = getFileName(path.split('/').pop() || '');
      const code = getComponentCode(componentPath, projectStructure);
      const test = getComponentTest(componentPath, projectStructure);
      const response = await fetch('/api/run_unit_tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUser._id,
          framework: project.testing.framework,
          componentName: fileName, 
          code: code, 
          test 
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: TestResult = await response.json();
      setTestResults(prev => ({ ...prev, [componentPath]: result }));
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsGenerating(false)
    }
  };

  const runIntegrationTests = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/run_integration_tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: currentUser._id,
          framework: project.testing.framework,
          projectStructure: projectStructure, 
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: TestResult = await response.json();
      setIntegrationTestResults(result);
    } catch (error) {
      console.error('Error running integration tests:', error);
      setIntegrationTestResults({ passed: false, output: 'Error running integration tests' });
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateComponent = async (componentPath: string) => {
    setIsGenerating(true);
    try {
      const segments = componentPath.split('/');
      const fileName = getFilename(segments[segments.length - 1]);
      const code = getComponentCode(componentPath, projectStructure);
      const response = await fetch('/api/generate_component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: fileName, existingCode: code, existingStructure: projectStructure }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: { code: string; test: string } = await response.json();
      updateCode(componentPath, data.code);
      const testFilePath = getComponentTest(currentComponent, projectStructure).path
      if (testFilePath !== "") updateCode(testFilePath, data.test);
    } catch (error) {
      console.error('Error regenerating component:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getComponentCode = useCallback((path: string, projectStructure: ProjectStructure): string => {
    let current: any = projectStructure;
    for (const segment of path.split('/')) {
      if (!current || typeof current !== 'object') {
        console.warn(`Invalid path segment: ${segment}`);
        return '';
      }
      current = current[segment];
      if (current?.type === 'file') {
        break;
      }
    }
    if (!current || typeof current !== 'object' || !('content' in current)) {
      console.warn(`Invalid path or missing file: ${path}`);
      return '';
    }
    return current.content || '';
  }, []);

  const getComponentTest = (path: string, projectStructure: ProjectStructure): { content: string; path: string } => {
    let current: any = projectStructure;
    for (const segment of path.split('/')) {
      if (!current || typeof current !== 'object') {
        console.warn(`Invalid path segment: ${segment}`);
        return { content: '', path: '' };
      }
      current = current[segment];
      if (current?.type === 'file') {
        break;
      }
    }
    if (!current || typeof current !== 'object' || !('content' in current)) {
      console.warn(`Invalid path or missing file: ${path}`);
      return { content: '', path: '' };
    }
    const testFileName = getTestFileName(path.split('/').pop() || '');
    const searchTestFile = (structure: any, currentPath: string = ''): { content: string; path: string } => {
      if (structure.type === 'file' && structure.name === testFileName) {
        return { content: structure.content || '', path: currentPath + '/' + structure.name };
      }
      if (structure.type === 'directory') {
        for (const [name, item] of Object.entries(structure)) {
          const result = searchTestFile(item, currentPath + '/' + name);
          if (result.content) return result;
        }
      }
      return { content: '', path: '' };
    };
    const { content: testContent, path: testPath } = searchTestFile(projectStructure);
    if (testContent) {
      return { content: testContent, path: testPath.slice(1) };
    }
    return { content: '', path: '' };
  };

  const updateCode = async (path?: string, newCode: string) => {
    try {
      if (path) {
        const updatedStructure = JSON.parse(JSON.stringify(projectStructure));
        const pathParts = path.split('/').filter(Boolean);
        let currentLevel = updatedStructure;
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!currentLevel[pathParts[i]]) {
            currentLevel[pathParts[i]] = { type: "directory" };
          }
          currentLevel = currentLevel[pathParts[i]];
        }
        const fileName = pathParts[pathParts.length - 1];
        if (!currentLevel[fileName]) {
          currentLevel[fileName] = { content: "", type: "file" };
        }
        currentLevel[fileName].content = newCode;
        await updateProjectStructure(project._id, updatedStructure);
      } else if (currentCodeFile) {
        const updatedCodeFile = { ...currentCodeFile, content: newCode };
        setCurrentCodeFile(updatedCodeFile);
      } else {
        console.warn("No current component or code file to update.");
      }
    } catch (error) {
      console.error("Error in updateCode:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
    }
  };

  // Helper function to update project structure
  const updateProjectStructure = async (projectId: Id<"codes">, updatedStructure: ProjectStructure) => {
    try {
      const result = await updateProject({
        id: projectId,
        project: {
          structure: updatedStructure
        }
      });
      return result;
    } catch (updateError) {
      console.error('Error in updateProject mutation:', updateError);
      if (updateError instanceof Error) {
        console.error('Update error details:', updateError.message, updateError.stack);
      }
      throw updateError;
    }
  };

  const getAllFilePaths = (obj: any, currentPath: string = ''): string[] => {
    let paths: string[] = [];
    if (typeof obj === 'object' && obj !== null) {
      if ('type' in obj && obj.type === 'file') {
        paths.push(currentPath);
      } else {
        for (const [key, value] of Object.entries(obj)) {
          if (key !== 'type') {
            const newPath = currentPath ? `${currentPath}/${key}` : key;
            paths = paths.concat(getAllFilePaths(value, newPath));
          }
        }
      }
    }
    return paths;
  };

  const moveToNextComponent = () => {
    const allPaths = getAllFilePaths(projectStructure);
    const currentIndex = allPaths.indexOf(currentComponent);
    if (currentIndex < allPaths.length - 1) {
      setCurrentComponent(allPaths[currentIndex + 1]);
    }
  };

  const moveToPrevComponent = () => {
    const allPaths = getAllFilePaths(projectStructure);
    const currentIndex = allPaths.indexOf(currentComponent);
    if (currentIndex > 0) {
      setCurrentComponent(allPaths[currentIndex - 1]);
    }
  };

  const handleOnInsert = (content: string) => {
    setIsInsertedContent(true);
    setInsertedContent(content);
  };

  const handleReplaceCode = (content: string) => {
    updateCode(currentComponent, content);
  };

  const handleInsertAboveCode = (content: string) => {
    const updatedContent = content + '\n' + componentContent; 
    updateCode(currentComponent, updatedContent);
  };

  const handleInsertBelowCode = (content: string) => {
    const updatedContent = componentContent + '\n' + content; 
    updateCode(currentComponent, updatedContent);
  };

  const handleInsertLeftCode = (content: string) => {
    const lines = componentContent.split('\n');
    const updatedContent = content + '\n' + lines.join('\n'); 
    updateCode(currentComponent, updatedContent);
  };

  const handleInsertRightCode = (content: string) => {
    const updatedContent = componentContent + '\n' + content; 
    updateCode(currentComponent, updatedContent);
  };

  const allTestsPassed = Object.values(testResults).every(result => result.passed);

  const componentContent = useMemo(() => {
    if (currentComponent) {
      const content = getComponentCode(currentComponent, projectStructure) || '';
      setCurrentFileContent(content);
      return content; 
    } else if (currentCodeFile) {
      const content = Object.values(currentCodeFile)[0] || '';
      setCurrentFileContent(content);
      return content;
    }
    return '';
  }, [currentComponent, projectStructure, currentCodeFile, setCurrentFileContent]);

  const componentTest = useMemo(() => {
    if (currentComponent) {
      return getComponentTest(currentComponent, projectStructure).content || '';
    } 
    return '';
  }, [currentComponent, projectStructure]);

  const componentName = useMemo(() => {
    return currentComponent || (currentCodeFile && Object.keys(currentCodeFile)[0]) || '';
  }, [currentComponent, currentCodeFile]);

  if (project === undefined) {
    return <ProjectSkeleton />;
  }
  
  if (project === null) {
    return <ProjectNotFound />;
  }

  return (
    <>
      <RenderContent 
        settings={settings}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        handleSettingChange={handleSettingChange}
        theme={theme}
        insertedContent={insertedContent}
        isInsertedContent={isInsertedContent}
        setIsInsertedContent={setIsInsertedContent}
        setInsertedContent={setInsertedContent}
        handleOnInsert={handleOnInsert}
        handleReplaceCode={handleReplaceCode}
        handleInsertAboveCode={handleInsertAboveCode}
        handleInsertBelowCode={handleInsertBelowCode}
        handleInsertLeftCode={handleInsertLeftCode}
        handleInsertRightCode={handleInsertRightCode}
        currentComponent={currentComponent}
        setCurrentComponent={setCurrentComponent}
        currentCodeFile={currentCodeFile}
        setCurrentCodeFile={setCurrentCodeFile}
        currentEmbeddedFile={currentEmbeddedFile}
        setCurrentEmbeddedFile={setCurrentEmbeddedFile}
        componentName={componentName}
        componentContent={componentContent}
        componentTest={componentTest}
        updateCode={updateCode}
        runUnitTests={runUnitTests}
        regenerateComponent={regenerateComponent}
        testResults={testResults}
        runIntegrationTests={runIntegrationTests}
        integrationTestResults={integrationTestResults}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showFilePreview={showFilePreview}
        showComponentEditor={showComponentEditor}
        detectFramework={detectFramework}
      />
    </>
  );
};

export default ProjectPage;