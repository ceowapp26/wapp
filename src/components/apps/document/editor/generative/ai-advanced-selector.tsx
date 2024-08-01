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
  BrainCircuit
} from "lucide-react";
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
import { useStore } from "@/redux/features/apps/document/store";
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
  const [openDialog, setOpenDialog] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setInputContext = useStore((state) => state.setInputContext);
  const setInputModel = useStore((state) => state.setInputModel);
  const { aiContext, aiModel, resData, setResData, showWarning, warningType, nextTimeUsage, setAiContext, setAiModel, setInputType, setOutputType, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { handleAIDynamicFunc } = useDynamicSubmit({ prompt: prompt, option: _option, setIsLoading: setIsLoading, setError: setError, setResData: setResData, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage });

  const handleSetup = useCallback((selectedOption: string) => {
    _setOption(selectedOption)
    setAiContext("advanced");
    setAiModel("openAI");
    setInputContext("general");
    setInputType("text-only");
    setInputModel("gpt-3.5-turbo");
    setOutputType("text");    
    const slice = editor.state.selection.content();
    const text = editor.storage.markdown.serializer.serialize(slice.content);
    setPrompt(text);
  }, [editor, setAiContext, setAiModel, _setOption, setInputContext, setInputModel, setInputType, setOutputType, setPrompt]);

  const handleAIGenerate = useCallback(() => {
    if (aiContext === "advanced" && prompt && _option && !isLoading) {
      try {
        setIsLoading(true);
        setOpenDialog(true);
        handleAIDynamicFunc();
      } catch (error) {
        setOpenDialog(false);
        onOpenChange(false);
        console.error("Error generating content:", error);
        toast.error("Failed to generate content. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [prompt, aiContext, _option, isLoading, setOpenDialog, setIsLoading, onOpenChange]);

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

  const handleInsert = () => {
    if (selectedOption) {
      switch (selectedOption) {
        case "treenode":
          editor.chain().focus().insertAITreeNode().run();
          break;
        case "graphnode":
          editor.chain().focus().insertAIGraphNode().run();
          break;
        case "dashboard":
          editor.chain().focus().insertAIDashboardNode().run();
          break;
        case "keywordtree":
          editor.chain().focus().insertAIKeywordTreeNode().run();
          break;
        case "icon":
          editor.chain().focus().insertIconNode().run();
          break;
        default:
          break;
      }
      setOpenDialog(false);
      onOpenChange(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resData || "");
  };

  const CommandButtonGroups: React.FC = () => {
    return (
      <div className="group flex w-full justify-center">
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-2">
            <InsertButton onClick={() => handleInsert()} />
            <RefreshButton onClick={() => handleSubmit({ value: selectedOption })} />
            <CopyButton onClick={handleCopy} />
          </div>
        </div>
      </div>
    );
  };

  const DialogWrapper: React.FC<{ children: React.ReactNode }> = ({
      children,
    }) => {
      return (
        <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
          <DialogContent>
            <DialogHeader className="border-b pb-3">
              <h2 className="text-lg font-medium">Details</h2>
            </DialogHeader>
            <div className="flex flex-col w-full overflow-auto max-h-[500px] items-center justify-between">
              {isLoading && <GradientLoadingCircle />}
              {!isLoading && resData && (
                <>
                  <SearchBar handleChange={handleSearch} disabled={isLoading} />
                  {searchResults.length === 0 ? (
                    <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                      No items found.
                    </p>
                  ) : (
                    <KeywordDetail keyword={searchResults[0]} />
                  )}
                  {children}
                </>
              )}
            </div>
            {resData ? <CommandButtonGroups /> : null}
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
      {selectedOption === "treenode" && (
        <DialogWrapper>
          <AITreeNodeView data={resData} />
        </DialogWrapper>
      )}
      {selectedOption === "graphnode" && (
        <DialogWrapper>
          <AIGraphNodeView data={resData} />
        </DialogWrapper>
      )}
      {selectedOption === "dashboard" && (
        <DialogWrapper>
          <AIDashboardNodeView data={resData} />
        </DialogWrapper>
      )}
      {selectedOption === "keywordtree" && (
        <DialogWrapper>
          <AIKeywordTreeNodeView data={resData} />
        </DialogWrapper>
      )}
      {selectedOption === "icon" && (
        <DialogWrapper>
          <AIIconNode data={resData} />
        </DialogWrapper>
      )}    
    {showWarning && (
      <Warning
        type={warningType}
        nextTimeUsage={nextTimeUsage}
      />
    )}
    </React.Fragment>
  );
};

export default AIAdvancedSelector;


