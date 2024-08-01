import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import debounce from 'lodash/debounce';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../ui/command';
import {
  RefreshCcwDot,
  WrapText,
  StepForward,
  ImagePlus,
  FileSearch,
  ScanText,
  BookText,
  Images, 
} from 'lucide-react';
import { useEditor } from '../core/index';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { GradientLoadingCircle } from '@/components/gradient-loading-circle';
import { Button } from '../ui/button';
import MagicIcon from '@/icons/MagicIcon';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { PopoverTrigger, Popover, PopoverContent } from '@/components/ui/popover';
import SearchBar from '@/components/searchbar';
import RefreshButton from '@/components/ui/buttons/refresh-button';
import InsertButton from '@/components/ui/buttons/insert-button';
import CopyButton from '@/components/ui/buttons/copy-button';
import KeywordDetail from '../nodes';
import { toast } from 'sonner';
import { createAIImage } from "../plugins"
import { useEdgeStore } from '@/lib/edgestore';
import { EdgeStoreApiClientError } from '@edgestore/react/shared';
import { useDynamicSubmit } from "@/hooks/use-dynamic-submit";
import { useGeneralContext } from '@/context/general-context-provider';
import { useStore } from "@/redux/features/apps/document/store";
import { useTranslation } from "react-i18next";
import Warning from '@/components/models/warning'; 

const LazyAIImage = React.lazy(() => import('../nodes/ai-image-node'));

interface AIImageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isGemini: boolean; 
}

const AIImageSelector: React.FC<AIImageSelectorProps> = ({ open, onOpenChange, isGemini }) => {
  const { editor } = useEditor();
  const { t } = useTranslation('api');
  const pos = editor.view.state.selection.from;
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [resData, setResData] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const setInputContext = useStore((state) => state.setInputContext);
  const setInputModel = useStore((state) => state.setInputModel);
  const { aiContext, aiModel, showWarning, warningType, nextTimeUsage, setAiContext, setAiModel, setInputType, setOutputType, setShowWarning, setWarningType, setNextTimeUsage } = useGeneralContext();
  const { handleAIDynamicFunc } = useDynamicSubmit({ prompt: prompt, option: selectedOption, setIsLoading: setIsLoading, setResData: setResData, setError: setError, setShowWarning: setShowWarning, setWarningType: setWarningType, setNextTimeUsage: setNextTimeUsage });
  
  const handleSetup = useCallback((selectedOption: string) => {
    setSelectedOption(selectedOption);
    setAiContext("image");
    setInputContext("general");
    if (isGemini) {
      setAiModel("gemini");
      setInputModel("gemini-1.5-pro");
      setInputType("text-image");
      setOutputType("text");
    } else {
      setAiModel("openAI");
      setInputModel("dall-e-3");
      setInputType("text-only");
      setOutputType("image");
    }
    const slice = editor.state.selection.content();
    const text = editor.storage.markdown.serializer.serialize(slice.content);
    setPrompt(text);
  }, [editor, isGemini, setAiContext, setAiModel, setSelectedOption, setInputContext, setInputModel, setInputType, setOutputType, setPrompt]);

  const handleAIGenerate = useCallback(() => {
    if (aiContext === "image" && prompt && selectedOption && !isLoading) {
      try {
        setIsLoading(true);
        setOpenDialog(true);
        handleAIDynamicFunc();
      } catch (error) {
        setOpenDialog(false);
        onOpenChange(false);
        console.error("Error generating image:", error);
        toast.error("Failed to generate image. Please try again.");
      } finally {
        setIsLoading(false);
        setOpenDialog(false);
        onOpenChange(false);
      }
    }
  }, [prompt, aiContext, isLoading, selectedOption, setIsLoading, setOpenDialog, onOpenChange, handleAIDynamicFunc]);

  const handleSubmit = useCallback((selectedOption: string) => {
    handleSetup(selectedOption);
    setSelectedOption(selectedOption);
    handleAIGenerate();
  }, [setSelectedOption, handleSetup, handleAIGenerate]);

  let imageOptions = [];

  switch (isGemini) {
    case true:
      imageOptions = [
        {
          value: 'describe',
          label: 'Image Description',
          icon: BookText,
        },
        {
          value: 'extract',
          label: 'Text Extraction',
          icon: ScanText,
        },
      ];
      break;
    case false:
      imageOptions = [
        {
          value: 'search',
          label: 'Search Image',
          icon: FileSearch,
        },
        {
          value: 'generate',
          label: 'Image Generator',
          icon: Images,
        },
      ];
      break;
    default:
      imageOptions = [
        {
          value: 'search',
          label: 'Search Image',
          icon: FileSearch,
        },
        {
          value: 'generate',
          label: 'Image Generator',
          icon: Images,
        },
      ];
  };

  const debouncedUpdateFilter = useRef(
    debounce((filteredResults: any[]) => {
      setSearchResults(filteredResults);
    }, 500)
  ).current;

  useEffect(() => {
    debouncedUpdateFilter(searchResults);
  }, [searchResults]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredResults = resData?.keywords
      ? resData.keywords.filter((keyword: { title: string }) =>
          keyword.title.toLowerCase().includes(e.target.value.toLowerCase())
        )
      : [];
    setSearchResults(filteredResults);
  };

  const insertTextAI = (content) => {
    const selection = editor.state.selection;
    const endPos = selection.$to.pos;
    editor
      .chain()
      .focus()
      .insertContentAt(endPos, ` ${content}`)
      .run();
  };

  const handleInsert = () => {
    switch (selectedOption) {
      case "generate":
      case "search":
        createAIImage(resData, editor.view, pos);
        break;
      case "describe":
      case "extract":
        insertTextAI(resData);
        break;
      default:
        break;
    }
    setOpenDialog(false);
    onOpenChange(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resData || '');
  };

  const CommandButtonGroups: React.FC = () => {
    return (
      <div className="group flex w-full justify-center">
        <div className="flex justify-center mt-2">
          <div className="flex items-center gap-2">
            <InsertButton onClick={handleInsert} />
            <RefreshButton onClick={() => handleSubmit(selectedOption)} />
            <CopyButton onClick={handleCopy} />
          </div>
        </div>
      </div>
    );
  };

  const DialogWrapper: React.FC = () => (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">Details</h2>
        </DialogHeader>
        <div className="flex flex-col w-full overflow-auto max-h-[500px] items-center justify-between">
          {isLoading && <GradientLoadingCircle />}
          {!isLoading && (
            <>
              <SearchBar handleChange={handleSearch} disabled={isLoading} />
              {(selectedOption === 'generate' || selectedOption === 'extract') && resData && (
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <Suspense fallback={<GradientLoadingCircle />}>
                    <LazyAIImage url={resData} alt="Generated Image" className="max-h-48 max-w-full" />
                  </Suspense>
                </div>
              )}
              {(!selectedOption === 'generate' || !selectedOption === 'extract') && resData && (
                <h1 className="text-xl font-bold text-center text-blue-600 my-8">{resData}</h1>
              )}
            </>
          )}
        </div>
        {resData && !isLoading && <CommandButtonGroups />}
      </DialogContent>
    </Dialog>
  );

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
            <ImagePlus className="h-5 w-5" />
            Image AI
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={5}
          className="my-1 flex max-h-80 w-60 flex-col overflow-hidden overflow-y-auto rounded border p-1 shadow-xl"
          align="start"
        >
          <Command className="w-[350px]">
            <CommandList>
              <CommandGroup heading="Describe or extract image">
                {imageOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    className="flex space-x-2 gap-2 px-4"
                    value={option.value}
                    onSelect={() => {
                      setSelectedOption(option.value);
                      handleSubmit(option.value);
                    }}
                  >
                    <option.icon className="h-4 w-4 text-purple-500" />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogWrapper />
     {showWarning && (
        <Warning
          type={warningType}
          nextTimeUsage={nextTimeUsage}
        />
      )}
    </React.Fragment>
  );
};

export default AIImageSelector;






