"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/spinner";
import { FilterCommand } from "@/components/apps/document/filter-command";
import { SearchCommand } from "@/components/apps/document/search-command";
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { useMutation, useQuery } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { debounce } from 'lodash';
import { SnippetInterface } from '@/types/snippet';
import Warning from "@/components/apps/modals/warning-modal";
import { usePathname } from 'next/navigation';
import { useStoreUser } from "@/hooks/use-store-user";
import dynamic from 'next/dynamic';

const DocumentMetadataModal = dynamic(() => import('@/components/apps/document/modals/document-metadata-modal'), { ssr: false });
const DocumentManagementModal = dynamic(() => import('@/components/apps/document/modals/document-management-modal'), { ssr: false });

const DocumentLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, role } = useStoreUser();
  const setSnippets = useDocumentStore((state) => state.setSnippets);
  const [syncWithCloudWarning, setSyncWithCloudWarning] = useState(false);
  const { isAppbarCollapsed, activeDocument, setActiveDocument } = useMyspaceContext();
  const createSnippet = useMutation(api.snippets.createSnippet);
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

  const handleCreateCloudSnippet = async (snippet: SnippetInterface) => {
    try {
      return await createSnippet({ snippet: snippet });
    } catch (error) {
      console.error("Error creating cloud snippet:", error);
      toast.error("Failed to create cloud snippet. Please try again.");
      throw error;
    }
  };

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
    setSnippets(cloudSnippets);
    setSyncWithCloudWarning(false);
  }, [ 
    cloudSnippets, 
    setSnippets, 
    setSyncWithCloudWarning
  ]);

  if (!isLoading && !isAuthenticated) return;

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
        <DocumentManagementModal />
        {children}
      </main>
    </React.Fragment>
  );
};

export default DocumentLayout;
