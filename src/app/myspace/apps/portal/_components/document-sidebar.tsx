"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
  Share,
  FileUp,
  Filter,
  SquareArrowRight
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useFilter } from "@/hooks/use-filter";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { usePublish } from "@/hooks/use-publish";
import { useUploadFile } from "@/hooks/use-upload-file";
import { Item } from "./document-item";
import { DocumentList } from "./document-list";
import { TrashBox } from "./trash-box";
import { useMediaQuery } from "usehooks-ts";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { setPortalContext } from '@/stores/features/apps/portal/portalsSlice';
import { motion, AnimatePresence } from 'framer-motion';

export const DocumentSidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const filter = useFilter();
  const publish = usePublish();
  const uploadFile = useUploadFile();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { activeOrg, setActiveDocument, isLeftSidebarOpened, setIsLeftSidebarOpened, leftSidebarType, setLeftSidebarType, draggingItem, targetItem, setDraggingItem, setTargetItem } = useMyspaceContext();
  const createDocument = useMutation(api.documents.createDocument);
  const [dropTarget, setDropTarget] = useState<{id: string, effect: 'above' | 'below' | 'inside'} | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const updateDocument = useMutation(api.documents.updateDocument);
  const updateDocumentParent = useMutation(api.documents.updateDocumentParent);
  const getDocumentsByParentId = useMutation(api.documents.getDocumentsByParentId);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleCreate = () => {
    let createDocumentFunc;
    if (activeOrg.orgName === "Select Account" || !activeOrg.orgName || activeOrg.orgName === "Personal Account") {
      createDocumentFunc = createDocument({ title: "Untitled" });
    } else {
      createDocumentFunc = createDocument({ title: "Untitled", orgId: activeOrg.orgId });
    }

    const promise = createDocumentFunc
      .then((documentId) => {
        router.prefetch(`/myspace/apps/portal/document/${documentId}`);
        router.push(`/myspace/apps/portal/document/${documentId}`);
      });

    toast.promise(promise, {
      loading: "Creating a new document...",
      success: "New document created!",
      error: "Failed to create a new document."
    });
  };

  const handleSidebar = () => {
    dispatch(setPortalContext('left-ai'));
    if (!isLeftSidebarOpened) setIsLeftSidebarOpened(true);
  };

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropTarget(null);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggingItem(null);
    setDropTarget(null);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent, draggingItem: Doc<"documents"> | null, targetDocument: Doc<"documents"> | null) => {
    e.preventDefault();
    if (!draggingItem || (targetDocument && draggingItem._id === targetDocument._id)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const edgeThreshold = rect.height * 0.25;
    if (y < edgeThreshold) {
      setDropTarget({ id: targetDocument ? targetDocument._id : "root", effect: 'above' });
    } else if (y > rect.height - edgeThreshold) {
      setDropTarget({ id: targetDocument ? targetDocument._id : "root", effect: 'below' });
    } else if (targetDocument) {
      setDropTarget({ id: targetDocument._id, effect: 'inside' });
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, draggingItem: Doc<"documents"> | null, targetDocument: Doc<"documents"> | null) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggingItem) return;
    const draggedId = e.dataTransfer.getData('text');
    if (draggedId === targetDocument?._id) return;
    try {
      let newPosition: number;
      let newParentId: Id<"documents"> | undefined = targetDocument?.parentDocument;

      const updateSiblings = async (siblings: Doc<"documents">[], startIndex: number, endIndex: number, offset: number) => {
        for (let i = startIndex; i <= endIndex; i++) {
          if (siblings[i]._id !== draggedId) {
            await updateDocument({
              id: siblings[i]._id,
              position: siblings[i].position + offset,
            });
          }
        }
      };

      const getSiblings = async (parentId: Id<"documents"> | undefined) => {
        return await getDocumentsByParentId({
          ...(parentId && { parentDocument: parentId })
        });
      };

      if (targetDocument && dropTarget && dropTarget.id !== 'root') {
        const siblings = await getSiblings(targetDocument.parentDocument);
        siblings.sort((a, b) => a.position - b.position);

        const draggedIndex = siblings.findIndex(doc => doc._id === draggedId);
        const targetIndex = siblings.findIndex(doc => doc._id === targetDocument._id);

        switch (dropTarget.effect) {
          case 'above':
            newPosition = targetDocument.position;
            if (draggedIndex !== -1 && draggedIndex < targetIndex) {
              await updateSiblings(siblings, draggedIndex + 1, targetIndex - 1, -1);
            } else if (draggedIndex === -1 || draggedIndex > targetIndex) {
              await updateSiblings(siblings, targetIndex, draggedIndex !== -1 ? draggedIndex - 1 : siblings.length - 1, 1);
            }
            break;
          case 'below':
            newPosition = targetDocument.position + 1;
            if (draggedIndex !== -1 && draggedIndex < targetIndex) {
              await updateSiblings(siblings, draggedIndex + 1, targetIndex, -1);
            } else if (draggedIndex === -1 || draggedIndex > targetIndex) {
              await updateSiblings(siblings, targetIndex + 1, draggedIndex !== -1 ? draggedIndex - 1 : siblings.length - 1, 1);
            }
            break;
          case 'inside':
            newParentId = targetDocument._id;
            const childSiblings = await getSiblings(newParentId);
            newPosition = childSiblings.length;
            break;
        }

        if (draggedIndex !== -1 && dropTarget.effect !== 'inside') {
          await updateSiblings(siblings, draggedIndex + 1, siblings.length - 1, -1);
        }
        await updateDocument({
          id: draggedId,
          position: newPosition,
          parentDocument: newParentId
        });
      } else {
        const rootSiblings = await getSiblings(undefined);
        rootSiblings.sort((a, b) => a.position - b.position);

        switch (dropTarget?.effect) {
          case 'above':
            newPosition = 0;
            await updateSiblings(rootSiblings, 0, rootSiblings.length - 1, 1);
            break;
          case 'below':
          default:
            newPosition = rootSiblings.length;
            break;
        }
        newParentId = undefined;
        await updateDocumentParent({
          id: draggedId,
          position: newPosition,
        });
      }
      if (dropTarget?.effect === 'inside' && targetDocument) {
        setExpanded(prev => ({ ...prev, [targetDocument._id]: true }));
      }
    } catch (error) {
      console.error("Error in drag and drop operation:", error);
    }

    handleDragEnd();
  }, [draggingItem, dropTarget, getDocumentsByParentId, updateDocument, handleDragEnd]);

  return (
    <React.Fragment>
      <div className="mt-14 px-2">
        <Button
          className="flex items-center gap-x-3 px-3 py-3 mt-6 mb-4 ml-3
                     bg-gradient-to-r from-indigo-500 to-purple-600
                     text-white font-semibold text-md rounded-lg
                     shadow-lg hover:shadow-xl transition-all duration-300
                     transform hover:scale-105 active:scale-95
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          onClick={handleSidebar}
        >
          <SquareArrowRight className="w-6 h-6" />
          <span>Enter Chat</span>
        </Button>
        <Item
          label="Filter"
          icon={Filter}
          isFilter
          onClick={filter.onOpen}
        />
        <Item
          label="Search"
          icon={Search}
          isSearch
          onClick={search.onOpen}
        />
        <Item
          label="Publish"
          icon={Share}
          onClick={publish.onOpen}
        />
        <Item
          label="Upload"
          icon={FileUp}
          onClick={uploadFile.onOpen}
        />
        <Item
          label="Settings"
          icon={Settings}
          onClick={settings.onOpen}
        />
        <Item
          onClick={handleCreate}
          label="New page"
          icon={PlusCircle}
        />
      </div>
      <div 
        className="relative py-4"
        ref={rootRef}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => {
          e.preventDefault();
          handleDragOver(e, draggingItem, null);
        }}
        onDrop={(e) => handleDrop(e, draggingItem, null)}
      >
        {dropTarget?.id === 'root' && dropTarget.effect === 'above' && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.2 }}
            className="left-0 right-0 h-4 bg-violet-500/30 top-0"
          />
        )}
        <DocumentList
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          dropTarget={dropTarget}
          setDropTarget={setDropTarget}
        />
        {dropTarget?.id === 'root' && dropTarget.effect === 'below' && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.2 }}
            className="left-0 right-0 h-4 bg-violet-500/30 mt-2 bottom-0"
          />
        )}
      </div>
      <div className="mt-4">
        <Item
          onClick={handleCreate}
          icon={Plus}
          label="Add a page"
        />
        <Popover>
          <PopoverTrigger className="w-full mt-4">
            <Item label="Trash" icon={Trash} />
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-72"
            side={isMobile ? "bottom" : "right"}
          >
            <TrashBox />
          </PopoverContent>
        </Popover>
      </div>
    </React.Fragment>
  );
}

