import React, { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandList,
} from "../ui/command";
import {
  FileText,
  FileType,
  FileTerminal,
  SquarePen,
  MessageSquareText,
  ArrowDownWideNarrow,
  Shapes,
  Layers,
  Smile,
  Network,
  Waypoints,
  FolderTree, 
  FileSpreadsheet,
  BrainCircuit,
  Search, 
  RefreshCw, 
  Copy, 
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useEditor } from "../core/index";
import { GradientLoadingCircle } from "@/components/gradient-loading-circle";
import {
  AIDashboardNode,
  AIGraphNode,
  AIImageNode,
  AIIconNode,
  AIKeywordTreeNode,
  AITreeNode,
  KeywordDetail,
} from '../nodes'; 
import {
  AIGraphNodeView,
  AIDashboardNodeView, 
  AIIconNodeView,
  AITreeNodeView,
  AIKeywordTreeNodeView,
} from '../views'; 
import { Button } from "../ui/button";
import MagicIcon from "@/icons/MagicIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { useCompletion } from "ai/react";
import SearchBar from "@/components/searchbar";
import RefreshButton from "@/components/ui/buttons/refresh-button";
import InsertButton from "@/components/ui/buttons/insert-button";
import CopyButton from "@/components/ui/buttons/copy-button";
import { toast } from 'react-toastify';
import { APP_STATUS } from "@/constants/app";
import { defaultAdvancedAPIEndPoint } from "@/constants/chat";
import ComponentWrapper from "@/components/subscriptions/wrapper";
import { useGeneralContext } from '@/context/general-context-provider';
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import { useModelStore } from "@/stores/features/models/store";
import { useTranslation } from "react-i18next";
import Warning from '@/components/models/warning'; 

const textOptions = [
  { value: "summary", label: "Summary", icon: FileText, status: APP_STATUS.pro.text, color: APP_STATUS.pro.color },
  { value: "anomaly", label: "Anomaly", icon: Shapes, status: APP_STATUS.pro.text, color: APP_STATUS.pro.color },
  { value: "classifier", label: "Classifier", icon: Layers, status: APP_STATUS.pro.text, color: APP_STATUS.pro.color },
];

const summaryOptions = [
  { value: "treenode", label: "TreeNode", icon: Network, status: APP_STATUS.pro.text, color: APP_STATUS.pro.color },
  { value: "graphnode", label: "GraphNode", icon: Waypoints, status: APP_STATUS.pro.text, color: APP_STATUS.pro.color },
  { value: "dashboard", label: "Dashboard", icon: FileSpreadsheet, status: APP_STATUS.pro.text, color: APP_STATUS.pro.color },
  { value: "keywordtree", label: "KeywordTree", icon: FolderTree, status: APP_STATUS.pro.text, color: APP_STATUS.pro.color },
];

const iconOptions = [
  { value: "icon", label: "Icon", icon: Smile, status: APP_STATUS.pro.text, color: APP_STATUS.pro.color },
];

interface AIAdvancedSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DialogWrapperProps {
  children: React.ReactNode;
  isLoading: boolean;
}

const AIAdvancedSelector = ({
  open,
  onOpenChange,
}: AIAdvancedSelectorProps) => {
  const { editor } = useEditor();
  const { t } = useTranslation('api');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [_option, _setOption] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setInputContext = useModelStore((state) => state.setInputContext);
  const inputModel = useModelStore((state) => state.inputModel);
  const setInputModel = useModelStore((state) => state.setInputModel);
  const { aiContext, aiModel, resData, setResData, showWarning, warningType, nextTimeUsage, setAiContext, setAiModel, setIsSystemModel, setInputType, setOutputType, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { handleAIDynamicFunc } = useDynamicSubmit({ prompt: prompt, option: _option, setIsLoading: setIsLoading, setError: setError, setResData: setResData, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage });

  const handleSetup = useCallback((selectedOption: string) => {
    setIsSystemModel(true);    
    _setOption(selectedOption)
    setAiContext("advanced");
    setInputContext("general");
    setInputType("text-only");
    setOutputType("text");
    const slice = editor.state.selection.content();
    const text = editor.storage.markdown.serializer.serialize(slice.content);
    setPrompt(text);
  }, [editor, setAiContext, setAiModel, setIsSystemModel, _setOption, setInputContext, setInputModel, setInputType, setOutputType, setPrompt, inputModel]);

  const handleAIGenerate = useCallback(async () => {
    if (aiContext === "advanced" && prompt && _option && !isLoading) {
      setIsLoading(true);
      setOpenDialog(true);
      try {
        await handleAIDynamicFunc();
      } catch (error) {
        setOpenDialog(false);
        onOpenChange(false);
        console.error("Error generating content:", error);
        toast.error("Failed to generate content. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [prompt, aiContext, _option, isLoading, setOpenDialog, setIsLoading, onOpenChange, handleAIDynamicFunc]);

  const handleSubmit = useCallback((selectedOption: string) => {
    handleSetup(selectedOption);
    handleAIGenerate();
  }, [handleSetup, handleAIGenerate]);

  const debouncedUpdateFilter = useRef(
    debounce((f) => {
      setSearchResults(f);
    }, 500)
  ).current;

  useEffect(() => {
    debouncedUpdateFilter(searchResults);
  }, [searchResults]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredResults = resData?.keywords
      ? resData.keywords.filter((keyword) =>
          keyword.title.includes(e.target.value)
        )
      : [];
    setSearchResults(filteredResults);
  };

  const nodeTypeToCommandMap: Record<string, keyof EditorCommands> = {
    treenode: 'insertAITreeNode',
    graphnode: 'insertAIGraphNode',
    dashboard: 'insertAIDashboardNode',
    keywordtree: 'insertAIKeywordTreeNode',
    icon: 'insertAIIconNode',
  };

  const handleInsert = useCallback(() => {
    if (!selectedOption) return;
    const command = nodeTypeToCommandMap[selectedOption];
    if (command) {
      editor.chain().focus()[command]().run();
      setOpenDialog(false);
      onOpenChange(false);
    } else {
      console.warn(`Unsupported node type: ${selectedOption}`);
    }
  }, [selectedOption, editor, setOpenDialog, onOpenChange]);

  const handleCopy = () => {
    navigator.clipboard.writeText(resData || "");
  };

  const CommandButtonGroups: React.FC = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg shadow-lg"
      >
        <div className="flex justify-center items-center space-x-4">
          <AnimatedButton icon={<Send size={18} />} onClick={handleInsert} tooltip="Insert">
            Insert
          </AnimatedButton>
          <AnimatedButton icon={<RefreshCw size={18} />} onClick={() => handleSubmit({ value: selectedOption })} tooltip="Regenerate">
            Regenerate
          </AnimatedButton>
          <AnimatedButton icon={<Copy size={18} />} onClick={handleCopy} tooltip="Copy">
            Copy
          </AnimatedButton>
        </div>
      </motion.div>
    );
  };

  const AnimatedButton: React.FC<{ icon: React.ReactNode; onClick: () => void; tooltip: string; children: React.ReactNode }> = ({ icon, onClick, tooltip, children }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 cursor-pointer"
      onClick={onClick}
      title={tooltip}
    >
      {icon}
      <span className="ml-2 font-medium">{children}</span>
    </motion.button>
  );

  const DialogWrapper: React.FC<DialogWrapperProps> = ({ children, isLoading }) => {
    return (
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogHeader className="border-b pb-3">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-800 dark:text-gray-100"
            >
              AI-Generated Details
            </motion.h2>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex-grow flex items-center w-full max-h-[500px justify-center p-8 overflow-auto"
              >
                <GradientLoadingCircle size={60} thickness={4} />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-grow flex flex-col space-y-4 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200"
              >
                <SearchBar 
                  handleChange={handleSearch} 
                  disabled={isLoading} 
                  placeholder="Search keywords..."
                  icon={<Search className="text-gray-400" size={20} />}
                />
                {/*
                {searchResults.length === 0 ? (
                  <p className="text-center text-gray-500 italic">
                    No items found. Try a different search term.
                  </p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <KeywordDetail keyword={searchResults[0]} />
                  </motion.div>
                )}*/}
                {children}
              </motion.div>
            )}
          </AnimatePresence>
          {resData && !isLoading && <CommandButtonGroups />}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <React.Fragment>
      <Popover modal={true} open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            className="gap-1 rounded-none text-purple-500"
            variant="ghost"
            onClick={() => onOpenChange(true)}
            size="sm"
          >
            <BrainCircuit className="h-5 w-5" />
            Ask AI++
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={5}
          className="my-1 flex max-h-80 w-60 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl"
          align="start"
        >
          <Command className="w-[350px]">
            <CommandList>
              <CommandGroup heading="Summarize, classify & more">
                {textOptions.map((option) => (
                  <Popover key={option.value}>
                    <PopoverTrigger className="w-full">
                      {option.status === "PRO" ? (
                        <ComponentWrapper types={["PRO", "ULTIMATE"]}>
                          <CommandItem
                            className="flex space-x-2 gap-2 px-4"
                            value={option.value}
                            onSelect={() => setSelectedOption(option.value)}
                          >
                            <span
                              className="flex rounded-full text-white text-xs p-4 py-1"
                              style={{ backgroundColor: option.color }}
                            >
                              {option.status}
                            </span>
                            <option.icon className="h-4 w-4 text-purple-500" />
                            {option.label}
                          </CommandItem>
                        </ComponentWrapper>
                      ) : (
                        <CommandItem
                          className="flex space-x-2 gap-2 px-4"
                          value={option.value}
                          onSelect={() => setSelectedOption(option.value)}
                        >
                          <option.icon className="h-4 w-4 text-purple-500" />
                          {option.label}
                        </CommandItem>
                      )}
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      sideOffset={-90}
                      className="my-1 flex h-48 w-58 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl"
                      align="center"
                    >
                      {option.value === "summary" && (
                        <CommandGroup heading="AI Smart summary">
                          {summaryOptions.map((subOption) => (
                            subOption.status === "PRO" ? (
                              <ComponentWrapper types={["PRO", "ULTIMATE"]} key={subOption.value}>
                                <CommandItem
                                  className="flex space-x-2 gap-2 px-4"
                                  value={subOption.value}
                                  onSelect={() => {
                                    setSelectedOption(subOption.value);
                                    handleSubmit(option.value);
                                  }}
                                >
                                  <span
                                    className="flex rounded-full text-white text-xs p-4 py-1"
                                    style={{ backgroundColor: option.color }}
                                  >
                                    {option.status}
                                  </span>
                                  <subOption.icon className="h-4 w-4 text-purple-500" />
                                  {subOption.label}
                                </CommandItem>
                              </ComponentWrapper>
                            ) : (
                              <CommandItem
                                key={subOption.value}
                                className="flex space-x-2 gap-2 px-4"
                                value={subOption.value}
                                onSelect={() => {
                                  setSelectedOption(subOption.value);
                                  handleSubmit(option.value);
                                }}
                              >
                                <subOption.icon className="h-4 w-4 text-purple-500" />
                                {subOption.label}
                              </CommandItem>
                            )
                          ))}
                        </CommandGroup>
                      )}
                    </PopoverContent>
                  </Popover>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Icon Options">
                {iconOptions.map((option) => (
                  option.status === "PRO" ? (
                    <ComponentWrapper types={["PRO", "ULTIMATE"]} key={option.value}>
                      <CommandItem
                        onSelect={() => {
                          setSelectedOption(option.value);
                          handleSubmit(option.value);
                        }}
                        className="flex space-x-2 gap-2 px-4"
                        value={option.value}
                      >
                        <span
                          className="flex rounded-full text-white text-xs p-4 py-1"
                          style={{ backgroundColor: option.color }}
                        >
                          {option.status}
                        </span>
                        <option.icon className="h-4 w-4 text-purple-500" />
                        {option.label}
                      </CommandItem>
                    </ComponentWrapper>
                  ) : (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        setSelectedOption(option.value);
                        handleSubmit(option.value);
                      }}
                      className="flex space-x-2 gap-2 px-4"
                      value={option.value}
                    >
                      <option.icon className="h-4 w-4 text-purple-500" />
                      {option.label}
                    </CommandItem>
                  )
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogWrapper isLoading={isLoading}>
        {selectedOption === "treenode" && <AITreeNodeView data={resData} />}
        {selectedOption === "graphnode" && <AIGraphNodeView data={resData} />}
        {selectedOption === "dashboard" && <AIDashboardNodeView data={resData} />}
        {selectedOption === "keywordtree" && <AIKeywordTreeNodeView data={resData} />}
        {selectedOption === "icon" && <AIIconNodeView data={resData} color={"rgb(168 85 247)"} size={200} sizeRatio={1} effect={"none"} />}
      </DialogWrapper>
      {showWarning && (
        <Warning
          type={warningType}
          nextTimeUsage={nextTimeUsage}
          inputModel={inputModel}
        />
      )}
    </React.Fragment>
  );
};

export default AIAdvancedSelector;


