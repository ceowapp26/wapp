'use client';
import React, { createContext, useContext, useState } from 'react';
import useLocalStorage from "@/hooks/use-local-storage";
import { Organization } from "@/types/note";
import { SummaryData } from "@/types/ai";
import { Context, Model, InputType, OutputType, WarningType } from "@/types/ai"; 

interface GeneralContextType {
  contextContent: string;
  setContextContent: React.Dispatch<React.SetStateAction<string>>;
  aiContext: Context;
  setAiContext: React.Dispatch<React.SetStateAction<Context>>;
  aiModel: Model;
  setAiModel: React.Dispatch<React.SetStateAction<Model>>;
  isSystemModel: boolean;
  setIsSystemModel: React.Dispatch<React.SetStateAction<boolean>>;
  inputType: InputType;
  setInputType: React.Dispatch<React.SetStateAction<InputType>>;
  outputType: OutputType;
  resData: SummaryData;
  setResData: React.Dispatch<React.SetStateAction<SummaryData>>;
  selectedDocument: string;
  setSelectedDocument: React.Dispatch<React.SetStateAction<string>>;
  selectedChat: string;
  setSelectedChat: React.Dispatch<React.SetStateAction<string>>;
  selectedFolder: string;
  setSelectedFolder: React.Dispatch<React.SetStateAction<string>>;
  outputType: OutputType;
  setOutputType: React.Dispatch<React.SetStateAction<OutputType>>;
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
  showWarning: boolean;
  setShowWarning: React.Dispatch<React.SetStateAction<boolean>>;
  warningType: WarningType;
  setWarningType: React.Dispatch<React.SetStateAction<WarningType>>;
  nextTimeUsage: string;
  setNextTimeUsage: React.Dispatch<React.SetStateAction<string>>;
}

const GeneralContext = createContext<GeneralContextType | undefined>(undefined);

export const GeneralContextProvider: React.FC = ({ children }: { children: React.ReactNode }) => {
  const [aiModel, setAiModel] = useState<Model>('openai');
  const [aiContext, setAiContext] = useState<Context>(undefined);
  const [inputType, setInputType] = useState<InputType>("text-only");
  const [outputType, setOutputType] = useState<OutputType>("text");
  const [contextContent, setContextContent] = useState<string>(undefined);
  const [selectedDocument, setSelectedDocument] = useState<string>(undefined);
  const [selectedChat, setSelectedChat] = useState<string>(undefined);
  const [selectedFolder, setSelectedFolder] = useState<string>(undefined);
  const [resData, setResData] = useState<SummaryData>(undefined);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [isSystemModel, setIsSystemModel] = useState<boolean>(false);
  const [warningType, setWarningType] = useState<WarningType>("CURRENT");
  const [nextTimeUsage, setNextTimeUsage] = useState<string>(null);

  return (
    <GeneralContext.Provider value={{ 
      selectedDocument, setSelectedDocument,
      selectedChat, setSelectedChat,
      selectedFolder, setSelectedFolder,  
      aiContext, setAiContext,
      aiModel, setAiModel,
      isSystemModel, setIsSystemModel,
      inputType, setInputType,
      outputType, setOutputType,
      resData, setResData,
      contextContent, setContextContent,
      showWarning, setShowWarning,
      warningType, setWarningType,
      nextTimeUsage, setNextTimeUsage,
    }}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneralContext = () => {
  const context = useContext(GeneralContext);
  if (!context) {
    throw new Error('useGeneralContext must be used within a ContextProvider');
  }
  return context;
};

