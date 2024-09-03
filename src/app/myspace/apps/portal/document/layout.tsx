"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { FilterCommand } from "@/components/apps/document/filter-command";
import { SearchCommand } from "@/components/apps/document/search-command";
import { useInitializeNewChat } from '@/hooks/use-initialize-newchat';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { useMutation, useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { debounce } from 'lodash';
import { SnippetInterface } from '@/types/snippet';
import { ChatInterface, FolderInterface } from '@/types/chat';
import Warning from "@/components/apps/document/modals/warning-modal";
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const DocumentMetadataModal = dynamic(() => import('@/components/apps/document/modals/document-metadata-modal'), { ssr: false });
const DocumentManagementModal = dynamic(() => import('@/components/apps/document/modals/document-management-modal'), { ssr: false });
const ChatMetadataModal = dynamic(() => import('@/components/apps/document/modals/chat-metadata-modal'), { ssr: false });
const ChatManagementModal = dynamic(() => import('@/components/apps/document/modals/chat-management-modal'), { ssr: false });
const FolderManagementModal = dynamic(() => import('@/components/apps/document/modals/folder-management-modal'), { ssr: false });

const DocumentLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const initializeNewChat = useInitializeNewChat();
  const setChats = useDocumentStore((state) => state.setChats);
  const setFolders = useDocumentStore((state) => state.setFolders);
  const setSnippets = useDocumentStore((state) => state.setSnippets);
  const setArchivedChats = useDocumentStore((state) => state.setArchivedChats);
  const setArchivedFolders = useDocumentStore((state) => state.setArchivedFolders);
  const setCurrentChatIndex = useDocumentStore((state) => state.setCurrentChatIndex);
  const currentChatIndex = useDocumentStore((state) => state.currentChatIndex);
  const [syncWithCloudWarning, setSyncWithCloudWarning] = useState(false);
  const { isAppbarCollapsed, activeDocument, setActiveDocument } = useMyspaceContext();
  const createChat = useMutation(api.chats.createChat);
  const createFolder = useMutation(api.chats.createFolder);
  const createSnippet = useMutation(api.snippets.createSnippet);
  const cloudActiveChats = useQuery(api.chats.getActiveChats);
  const cloudArchivedChats = useQuery(api.chats.getArchivedChats);
  const cloudActiveFolders = useQuery(api.chats.getActiveFolders);
  const cloudArchivedFolders = useQuery(api.chats.getArchivedFolders);
  const cloudSnippets = useQuery(api.snippets.getSnippets);
  const currentHref = usePathname();

  useEffect(() => {
    const extractedId = extractDocumentIdFromUrl(currentHref);
    if (!activeDocument && isValidDocumentId(extractedId)) {
      setActiveDocument(extractedId);
    }
  }, [currentHref, activeDocument, setActiveDocument]);

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
      return await createChat({ chat: chat });
    } catch (error) {
      console.error("Error creating cloud chat:", error);
      toast.error("Failed to create cloud chat. Please try again.");
      throw error;
    }
  };

  const handleCreateCloudFolder = async (folderId: string, folderData: FolderInterface, isArchived: boolean) => {
    try {
      return await createFolder({ folderId: folderId, folderData: folderData, isArchived: isArchived });
    } catch (error) {
      console.error("Error creating cloud folder:", error);
      toast.error("Failed to create cloud folder. Please try again.");
      throw error;
    }
  };

  const handleCreateCloudSnippet = async (snippet: SnippetInterface) => {
    try {
      return await createSnippet({ snippet: snippet });
    } catch (error) {
      console.error("Error creating cloud snippet:", error);
      toast.error("Failed to create cloud snippet. Please try again.");
      throw error;
    }
  };

  const syncActiveChats = useCallback(debounce(async () => {
    try {
      const localData = localStorage.getItem('wapp_doc');
      if (!localData) return;
      const parsedLocalActiveChats = JSON.parse(localData).state.chats || [];
      if (cloudActiveChats && cloudActiveChats.length > 0) {
        if (parsedLocalActiveChats.length === 0) {
          setChats(cloudActiveChats);
          setCurrentChatIndex(0);
        } else if (JSON.stringify(parsedLocalActiveChats) !== JSON.stringify(cloudActiveChats)) {
          setSyncWithCloudWarning(true);
        }
      } else if ((!cloudActiveChats || cloudActiveChats.length === 0) && parsedLocalActiveChats && parsedLocalActiveChats.length > 0) {
        setChats(parsedLocalActiveChats);
        setCurrentChatIndex(0);
        const createChatPromises = parsedLocalActiveChats
          .filter(chat => !chat.cloudChatId)
          .map(chat => handleCreateCloudChat(chat));
        await Promise.all(createChatPromises);
      } else {
        const storedChats = useDocumentStore.getState().chats;
        if (!storedChats || storedChats.length === 0) {
          initializeNewChat();
        } else if (storedChats && !(currentChatIndex >= 0 && currentChatIndex < storedChats.length)) {
          setCurrentChatIndex(0);
        }
      }
    } catch (error) {
      console.error("Error syncing active chats:", error);
      toast.error("Failed to sync active chats. Please try again.");
    }
  }, 300), [cloudActiveChats, initializeNewChat, currentChatIndex, setChats, setCurrentChatIndex]);

  const syncArchivedChats = useCallback(debounce(async () => {
    try {
      const localData = localStorage.getItem('wapp_doc');
      if (!localData) return;
      const parsedLocalArchivedChats = JSON.parse(localData).state.archivedChats || [];
      if (cloudArchivedChats && cloudArchivedChats.length > 0) {
        if (parsedLocalArchivedChats.length === 0) {
          setArchivedChats(cloudArchivedChats);
        } else if (JSON.stringify(parsedLocalArchivedChats) !== JSON.stringify(cloudArchivedChats)) {
          setSyncWithCloudWarning(true);
        }
      } else if ((!cloudArchivedChats || cloudArchivedChats.length === 0) && parsedLocalArchivedChats && parsedLocalArchivedChats.length > 0) {
        setArchivedChats(parsedLocalArchivedChats);
        const createChatPromises = parsedLocalArchivedChats
          .filter(chat => !chat.cloudChatId)
          .map(chat => handleCreateCloudChat(chat));
        await Promise.all(createChatPromises);
      }
    } catch (error) {
      console.error("Error syncing archived chats:", error);
      toast.error("Failed to sync archived chats. Please try again.");
    }
  }, 300), [cloudArchivedChats, setArchivedChats]);

  const syncActiveFolders = useCallback(debounce(async () => {
    try {
      const localData = localStorage.getItem('wapp_doc');
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
    } catch (error) {
      console.error("Error syncing active folders:", error);
      toast.error("Failed to sync active folders. Please try again.");
    }
  }, 300), [cloudActiveFolders, setFolders]);

  const syncArchivedFolders = useCallback(debounce(async () => {
    try {
      const localData = localStorage.getItem('wapp_doc');
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
    } catch (error) {
      console.error("Error syncing archived folders:", error);
      toast.error("Failed to sync archived folders. Please try again.");
    }
  }, 300), [cloudArchivedFolders, setArchivedFolders]);

  const syncSnippets = useCallback(debounce(async () => {
    try {
      const localData = localStorage.getItem('wapp_doc');
      if (!localData) return;
      const parsedLocalData = JSON.parse(localData);
      const parsedLocalSnippets = parsedLocalData.state.snippets || [];
      
      if (cloudSnippets && cloudSnippets.length > 0) {
        if (parsedLocalSnippets.length === 0) {
          setSnippets(cloudSnippets);
        } else if (JSON.stringify(parsedLocalSnippets) !== JSON.stringify(cloudSnippets)) {
          setSyncWithCloudWarning(true);
        }
      } else if ((!cloudSnippets || cloudSnippets.length === 0) && parsedLocalSnippets && parsedLocalSnippets.length > 0) {
        setSnippets(parsedLocalSnippets);
        const createSnippetPromises = parsedLocalSnippets
          .filter(snippet => !snippet.cloudSnippetId)
          .map(snippet => handleCreateCloudSnippet(snippet));
        await Promise.all(createSnippetPromises);
      }
    } catch (error) {
      console.error("Error syncing snippets:", error);
      toast.error("Failed to sync snippets. Please try again.");
    }
  }, 300), [cloudSnippets, setSnippets]);

  useEffect(() => {
    if (cloudActiveChats !== undefined) {
      syncActiveChats();
    }
    return () => {
      syncActiveChats.cancel();
    };
  }, [cloudActiveChats, syncActiveChats]);

  useEffect(() => {
    if (cloudArchivedChats !== undefined) {
      syncArchivedChats();
    }
    return () => {
      syncArchivedChats.cancel();
    };
  }, [cloudArchivedChats, syncArchivedChats]);

  useEffect(() => {
    if (cloudActiveFolders !== undefined) {
      syncActiveFolders();
    }
    return () => {
      syncActiveFolders.cancel();
    };
  }, [cloudActiveFolders, syncActiveFolders]);

  useEffect(() => {
    if (cloudArchivedFolders !== undefined) {
      syncArchivedFolders();
    }
    return () => {
      syncArchivedFolders.cancel();
    };
  }, [cloudArchivedFolders, syncArchivedFolders]);

  useEffect(() => {
    if (cloudSnippets !== undefined) {
      syncSnippets();
    }
    return () => {
      syncSnippets.cancel();
    };
  }, [cloudSnippets, syncSnippets]);

  const handleKeepLocalStorage = () => {
    setSyncWithCloudWarning(false);
  };

  const handleKeepCloudStorage = useCallback(() => {
    setChats(cloudActiveChats);
    setArchivedChats(cloudArchivedChats);
    setFolders(cloudActiveFolders);
    setArchivedFolders(cloudArchivedFolders);
    setSnippets(cloudSnippets);
    setSyncWithCloudWarning(false);
  }, [
    cloudActiveChats, 
    cloudArchivedChats, 
    cloudActiveFolders, 
    cloudArchivedFolders, 
    cloudSnippets, 
    setChats, 
    setArchivedChats, 
    setFolders, 
    setArchivedFolders, 
    setSnippets, 
    setSyncWithCloudWarning
  ]);

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
      <main className={`relative flex-1 h-full max-h-[100vh] overflow-y-auto hide-scrollbar ${isAppbarCollapsed ? 'top-[110px]' : 'top-[210px]'}`}>
        <SearchCommand />
        <FilterCommand />
        <DocumentMetadataModal />
        <ChatMetadataModal />
        <DocumentManagementModal />
        <ChatManagementModal />
        <FolderManagementModal />
        {children}
      </main>
    </React.Fragment>
  );
};

export default DocumentLayout;
