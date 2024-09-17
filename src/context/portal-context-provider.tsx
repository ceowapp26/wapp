"use client"
import React, { useState } from 'react';
import { MessageInterface } from "@/types/chat";
import { ChatSession } from '@/types/ai';
import { ProjectStructure } from '@/types/code';

type Context = 'TEXT' | 'CODE' | 'IMAGE' | 'AUDIO' | 'VIDEO';

type InitialValuesProps = {
  chatHistory: MessageInterface[];
  setChatHistory: Dispatch<SetStateAction<MessageInterface[]>>;
  chatConversation: MessageInterface[];
  setChatConversation: Dispatch<SetStateAction<MessageInterface[]>>;
  editorChatSession: ChatSession;
  setEditorChatSession: Dispatch<SetStateAction<ChatSession | null>>;
  chatSession: ChatSession;
  setChatSession: Dispatch<SetStateAction<ChatSession | null>>;
  projectStructure: ProjectStructure;
  setProjectStructure: Dispatch<SetStateAction<ProjectStructure>>;
  currentFileContent: string;
  setCurrentFileContent: Dispatch<SetStateAction<string | null>>;
  currentComponent: string;
  setCurrentComponent: Dispatch<SetStateAction<string | null>>;
  activeProject: string;
  setActiveProject: Dispatch<SetStateAction<string | null>>;
  portalContext: Context;
  setPortalContext: Dispatch<SetStateAction<Context>>;
};

const InitialValues: InitialValuesProps = {
  portalContext: null,
  currentComponent: null,
  currentFileContent: null,
  activeProject: null,
  projectStructure: {},
  chatHistory: [],
  chatConversation: [],
  chatSession: null,
  editorChatSession: null,
  setPortalContext: () => {},
  setProjectStructure: () => {},
  setCurrentComponent: () => {},
  setCurrentFileContent: () => {},
  setActiveProject: () => {},
  setChatHistory: () => {},
  setChatConversation: () => {},
  setChatSession: () => {},
  setEditorChatSession: () => {},
};

const PortalContext = React.createContext<InitialValuesProps>(InitialValues);

const PortalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [portalContext, setPortalContext] = useState<Context>('TEXT');
  const [activeProject, setActiveProject] = useState<string>(null);
  const [currentComponent, setCurrentComponent] = useState<string>(null);
  const [currentFileContent, setCurrentFileContent] = useState<string | null>(null);
  const [projectStructure, setProjectStructure] = useState<ProjectStructure>({});
  const [chatHistory, setChatHistory] = useState<MessageInterface[]>([]);
  const [chatConversation, setChatConversation] = useState<MessageInterface[]>([]);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [editorChatSession, setEditorChatSession] = useState<ChatSession | null>(null);

  const values: InitialValuesProps = {
    portalContext,
    setPortalContext,
    projectStructure,
    setProjectStructure,
    chatHistory,
    setChatHistory,
    chatConversation,
    setChatConversation,
    chatSession,
    setChatSession,
    editorChatSession,
    setEditorChatSession,
    activeProject,
    setActiveProject,
    currentComponent, 
    setCurrentComponent,
    currentFileContent,
    setCurrentFileContent,
  };

  return <PortalContext.Provider value={values}>{children}</PortalContext.Provider>;
};

const usePortalContext = (): InitialValuesProps => {
  const state = React.useContext(PortalContext);
  return state;
};

export { PortalContextProvider, usePortalContext };
