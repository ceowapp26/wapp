"use client";
import React, { useEffect, useState } from "react";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { FilterCommand } from "@/components/apps/document/filter-command";
import { SearchCommand } from "@/components/apps/document/search-command";
import { SwitchLeftSidebar } from './_components/switch-sidebar';
import { useInitializeNewChat } from '@/hooks/use-initialize-newchat';
import { useStore } from '@/redux/features/apps/document/store';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { useMutation, useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { SnippetInterface } from '@/types/snippet';
import { ChatInterface, FolderInterface } from '@/types/chat';
import Warning from "@/components/apps/document/modals/warning-modal";
import { usePathname } from 'next/navigation';
import { calculateFloorMAR } from '@/utils/APILimitUtils';
import { UserCreditInfo, CloudModel } from '@/types/users';
import dynamic from 'next/dynamic';
const DocumentMetadataModal = dynamic(() => import('@/components/apps/document/modals/document-metadata-modal'), { ssr: false });
const DocumentManagementModal = dynamic(() => import('@/components/apps/document/modals/document-management-modal'), { ssr: false });
const ChatMetadataModal = dynamic(() => import('@/components/apps/document/modals/chat-metadata-modal'), { ssr: false });
const ChatManagementModal = dynamic(() => import('@/components/apps/document/modals/chat-management-modal'), { ssr: false });
const FolderManagementModal = dynamic(() => import('@/components/apps/document/modals/folder-management-modal'), { ssr: false });

const DocumentLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const initializeNewChat = useInitializeNewChat();
  const setChats = useStore((state) => state.setChats);
  const setFolders = useStore((state) => state.setFolders);
  const setSnippets = useStore((state) => state.setSnippets);
  const setArchivedChats = useStore((state) => state.setArchivedChats);
  const setArchivedFolders = useStore((state) => state.setArchivedFolders);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const currentChatIndex = useStore((state) => state.currentChatIndex);
  const [syncWithCloudWarning, setSyncWithCloudWarning] = useState(false);
  const { isAppbarCollapsed, activeDocument, setActiveDocument } = useMyspaceContext();
  const removeAllChats = useMutation(api.chats.removeAllChats);
  const createChat = useMutation(api.chats.createChat);
  const createFolder = useMutation(api.chats.createFolder);
  const createSnippet = useMutation(api.snippets.createSnippet);
  const cloudActiveChats = useQuery(api.chats.getActiveChats);
  const cloudArchivedChats = useQuery(api.chats.getArchivedChats);
  const cloudActiveFolders = useQuery(api.chats.getActiveFolders);
  const cloudArchivedFolders = useQuery(api.chats.getArchivedFolders);
  const cloudSnippets = useQuery(api.snippets.getSnippets);
  const currentUser = useQuery(api.users.getCurrentUser);
  const currentHref = usePathname();

  useEffect(() => {
    const extractedId = extractDocumentIdFromUrl(currentHref);
    if (!activeDocument && isValidDocumentId(extractedId)) {
      setActiveDocument(extractedId);
    }
  }, [currentHref, activeDocument]);

  const isValidDocumentId = (document: string) => {
    const idRegex = /^[a-zA-Z0-9]{32}$/; 
    return idRegex.test(document);
  };

  const extractDocumentIdFromUrl = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 1]; 
  };

  const handleCreateCloudChat = async (chat: ChatInterface) => {
    try {
      const result = await createChat({ chat: chat });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleCreateCloudFolder = async (folderId: string, folderData: FolderInterface, isArchived: boolean) => {
    try {
      const result = await createFolder({ folderId: folderId, folderData: folderData, isArchived: isArchived });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleCreateCloudSnippet = async (snippet: SnippetInterface) => {
    try {
      const result = await createSnippet({ snippet: snippet });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const syncActiveChats = async () => {
      const localData = localStorage.getItem('wapp');
      if (!localData) return;
      const parsedLocalActiveChats = JSON.parse(localData).state.chats || null;
      if (cloudActiveChats && cloudActiveChats.length > 0) {
        if (!parsedLocalActiveChats) {
          setChats(cloudActiveChats);
          setCurrentChatIndex(0);
        } else if (JSON.stringify(parsedLocalActiveChats) !== JSON.stringify(cloudActiveChats)) {
          setSyncWithCloudWarning(true);
        }
      } else if (!cloudActiveChats || cloudActiveChats.length === 0) {
        if (parsedLocalActiveChats && parsedLocalActiveChats.length > 0) {
          setChats(parsedLocalActiveChats);
          setCurrentChatIndex(0);
          const createChatPromises = parsedLocalActiveChats.map(chat => handleCreateCloudChat(chat));
          await Promise.all(createChatPromises);
        } else {
          initializeNewChat();
        }
      } else {
        const storedChats = useStore.getState().chats;
        if (!storedChats || storedChats.length === 0) {
          initializeNewChat();
        } else if (storedChats && !(currentChatIndex >= 0 && currentChatIndex < storedChats.length)) {
          setCurrentChatIndex(0);
        }
      }
    };

    if (cloudActiveChats !== undefined) {
      syncActiveChats();
    }
  }, [cloudActiveChats, initializeNewChat]);

  useEffect(() => {
    const syncArchivedChats = async () => {
      const localData = localStorage.getItem('wapp');
      if (!localData) return;
      const parsedLocalArchivedChats = JSON.parse(localData).state.archivedChats || null;
      if (cloudArchivedChats && cloudArchivedChats.length > 0) {
        if (!parsedLocalArchivedChats || parsedLocalArchivedChats.length === 0) {
          setArchivedChats(cloudArchivedChats);
        } else if (JSON.stringify(parsedLocalArchivedChats) !== JSON.stringify(cloudArchivedChats)) {
          setSyncWithCloudWarning(true);
        }
      } else if (!cloudArchivedChats || cloudArchivedChats.length === 0) {
        if (parsedLocalArchivedChats && parsedLocalArchivedChats.length > 0) {
          setArchivedChats(parsedLocalArchivedChats);
          const createChatPromises = parsedLocalArchivedChats.map(chat => handleCreateCloudChat(chat));
          await Promise.all(createChatPromises);
        }
      }
    };

    if (cloudArchivedChats !== undefined) {
      syncArchivedChats();
    }
  }, [cloudArchivedChats]);

  useEffect(() => {
    const syncActiveFolders = async () => {
      const localData = localStorage.getItem('wapp');
      if (!localData) return;
      const parsedLocalData = JSON.parse(localData);
      const parsedLocalActiveFolders = parsedLocalData.state.folders || null;
      if (cloudActiveFolders && cloudActiveFolders.length > 0) {
        if (!parsedLocalActiveFolders) {
          setFolders(cloudActiveFolders);
        } else if (JSON.stringify(parsedLocalActiveFolders) !== JSON.stringify(cloudActiveFolders)) {
          setSyncWithCloudWarning(true);
        }
      } else if (!cloudActiveFolders || cloudActiveFolders.length === 0) {
        if (parsedLocalActiveFolders && parsedLocalActiveFolders.length > 0) {
          setFolders(parsedLocalActiveFolders);
          const createFolderPromises = parsedLocalActiveFolders.map(folder => handleCreateCloudFolder(folder.id, folder, false));
          await Promise.all(createFolderPromises);
        }
      }
    };

    if (cloudActiveFolders !== undefined) {
      syncActiveFolders();
    }
  }, [cloudActiveFolders]);

  useEffect(() => {
    const syncArchivedFolders = async () => {
      const localData = localStorage.getItem('wapp');
      if (!localData) return;
      const parsedLocalData = JSON.parse(localData);
      const parsedLocalArchivedFolders = parsedLocalData.state.archivedFolders || null;
      if (cloudArchivedFolders && cloudArchivedFolders.length > 0) {
        if (!parsedLocalArchivedFolders || parsedLocalArchivedFolders.length === 0) {
          setArchivedFolders(cloudArchivedFolders);
        } else if (JSON.stringify(parsedLocalArchivedFolders) !== JSON.stringify(cloudArchivedFolders)) {
          setSyncWithCloudWarning(true);
        }
      } else if (!cloudArchivedFolders || cloudArchivedFolders.length === 0) {
        if (parsedLocalArchivedFolders && parsedLocalArchivedFolders.length > 0) {
          setArchivedFolders(parsedLocalArchivedFolders);
          const createFolderPromises = parsedLocalArchivedFolders.map(folder => handleCreateCloudFolder(folder.id, folder, true));
          await Promise.all(createFolderPromises);
        }
      }
    };

    if (cloudArchivedFolders !== undefined) {
      syncArchivedFolders();
    }
  }, [cloudArchivedFolders]);

  useEffect(() => {
    const syncSnippets = async () => {
      const localData = localStorage.getItem('wapp');
      if (!localData) return;
      const parsedLocalData = JSON.parse(localData);
      const parsedLocalSnippets = parsedLocalData.state.snippets || null;
      if (cloudSnippets && cloudSnippets.length > 0) {
        if (!parsedLocalSnippets) {
          setSnippets(cloudSnippets);
        } else if (JSON.stringify(parsedLocalSnippets) !== JSON.stringify(cloudSnippets)) {
          setSyncWithCloudWarning(true);
        }
      } else if (!cloudSnippets || cloudSnippets.length === 0) {
        if (parsedLocalSnippets && parsedLocalSnippets.length > 0) {
          setSnippets(parsedLocalSnippets);
          const createSnippetPromises = parsedLocalSnippets.map(snippet => handleCreateCloudSnippet(snippet));
          await Promise.all(createSnippetPromises);
        }
      }
    };

    if (cloudSnippets !== undefined) {
      syncSnippets();
    }
  }, [cloudSnippets]);

  const handleKeepLocalStorage = () => {
    setSyncWithCloudWarning(false);
  };

  const handleKeepCloudStorage = () => {
    setChats(cloudActiveChats);
    setArchivedChats(cloudArchivedChats);
    setFolders(cloudActiveFolders);
    setArchivedFolders(cloudArchivedFolders);
    setSnippets(cloudSnippets);
    setSyncWithCloudWarning(false);
  };

   if (isLoading) {
    return (
      <div className="min-h-screen h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <React.Fragment>
      {syncWithCloudWarning && (
        <Warning
          handleKeepLocalStorage={handleKeepLocalStorage}
          handleKeepCloudStorage={handleKeepCloudStorage}
        />
      )}
      <div className="h-full flex dark:bg-[#1F1F1F]">
        <SwitchLeftSidebar />
        <main className={`relative flex-1 h-full max-h-[100vh] overflow-y-auto ${isAppbarCollapsed ? 'top-[110px]' : 'top-[210px]'}`}>
          <SearchCommand />
          <FilterCommand />
          <DocumentMetadataModal />
          <ChatMetadataModal />
          <DocumentManagementModal />
          <ChatManagementModal />
          <FolderManagementModal />
          {children}
        </main>
      </div>
    </React.Fragment>
  );
};

export default DocumentLayout;





