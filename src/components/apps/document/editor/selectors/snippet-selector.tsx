import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor } from '../core/index';
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Button } from '../ui/button';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { ClipboardPlus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SnippetInterface } from '@/types/snippet';

interface SnippetEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SnippetSelector: React.FC<SnippetEditorProps> = ({ open, onOpenChange }) => {
  const { editor } = useEditor();
  const setSnippets = useDocumentStore((state) => state.setSnippets);
  const setCurrentSnippetIndex = useDocumentStore((state) => state.setCurrentSnippetIndex);
  const snippets = useDocumentStore((state) => state.snippets);
  const createSnippet = useMutation(api.snippets.createSnippet);
  const {
    isRightSidebarOpened,
    setIsRightSidebarOpened,
    rightSidebarType,
    setRightSidebarType,
  } = useMyspaceContext();

  const [snippetName, setSnippetName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleCreateCloudSnippet = useCallback(async (snippet: SnippetInterface) => {
    try {
      const promise = createSnippet({ snippet });
      toast.promise(promise, {
        loading: "Creating a new snippet...",
        success: "New snippet created!",
        error: "Failed to create a new snippet."
      });
      return await promise;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [createSnippet]);

  const handleSidebar = useCallback(() => {
    if (rightSidebarType !== 'snippet') setRightSidebarType('snippet');
    if (!isRightSidebarOpened) setIsRightSidebarOpened(true);
  }, [rightSidebarType, isRightSidebarOpened, setRightSidebarType, setIsRightSidebarOpened]);

  const handleCreateSnippet = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editor) return;

    handleSidebar();
    
    const slice = editor.state.selection.content();
    const text = editor.storage.markdown.serializer.serialize(slice.content);
    
    if (!text.trim()) {
      toast.error("Please select some text to create a snippet.");
      return;
    }

    const snippetId = uuidv4();
    const newSnippet: SnippetInterface = {
      snippetId,
      snippetName,
      expanded: false,
      isArchived: false,
      isPublished: false,
      content: text,
      order: 0
    };
    
    try {
      const cloudSnippetId = await handleCreateCloudSnippet(newSnippet);
      if (cloudSnippetId) {
        newSnippet.cloudSnippetId = cloudSnippetId;
        const updatedSnippets = [newSnippet, ...snippets.map(s => ({ ...s, order: s.order + 1 }))];
        setSnippets(updatedSnippets);
        setCurrentSnippetIndex(0);
      }
    } catch (error) {
      console.error('Error creating snippet in the cloud:', error);
    } finally {
      setSnippetName("");
    }
  }, [editor, snippetName, snippets, handleCreateCloudSnippet, setSnippets, setCurrentSnippetIndex, handleSidebar]);

  if (!editor) return null;

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="gap-2 rounded-none border-none"
        >
          <ClipboardPlus className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-0" sideOffset={10}>
        <form onSubmit={handleCreateSnippet} className="flex p-1">
          <input
            ref={inputRef}
            type="text"
            value={snippetName}
            placeholder="Snippet name"
            className="flex-1 bg-background p-1 text-sm outline-none"
            onChange={(e) => setSnippetName(e.target.value)}
          />
          <button type="submit" className="mr-2 text-blue-500">
            Create
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};