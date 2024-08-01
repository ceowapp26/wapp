import React, { useEffect, useRef, useState } from 'react';
import { useEditor } from '../core/index';
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from '../ui/button';
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { ClipboardPlus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/redux/features/apps/document/store';
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { SnippetInterface } from '@/types/snippet';

interface SnippetEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SnippetSelector: React.FC<SnippetEditorProps> = ({ open, onOpenChange }) => {
  const { editor } = useEditor();
  const setSnippets = useStore((state) => state.setSnippets);
  const setCurrentSnippetIndex = useStore((state) => state.setCurrentSnippetIndex);

  const inputRef = useRef<HTMLInputElement>(null);
  const createSnippet = useMutation(api.snippets.createSnippet);

  const handleCreateCloudSnippet = async (snippet: SnippetInterface) => {
    try {
      const result = await createSnippet({ snippet });
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  if (!editor) return null;

  const {
    isRightSidebarOpened,
    setIsRightSidebarOpened,
    rightSidebarType,
    setRightSidebarType,
  } = useMyspaceContext();

  const addSnippet = (snippet: SnippetInterface) => {
    const snippets = useStore.getState().snippets;
    setSnippets([...snippets, snippet]);
  };

  const [snippetName, setSnippetName] = useState('');

  const handleSidebar = () => {
    if (rightSidebarType !== 'snippet') setRightSidebarType('snippet');
    if (!isRightSidebarOpened) setIsRightSidebarOpened(true);
  };

  const handleCreateSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSidebar();
    const slice = editor.state.selection.content();
    const text = editor.storage.markdown.serializer.serialize(slice.content);
    const snippets = useStore.getState().snippets;
    const snippetId = uuidv4();
    const newSnippet: SnippetInterface = {
      snippetId: snippetId,
      snippetName: snippetName,
      expanded: false,
      isArchived: false,
      isPublished: false,
      content: text,
      order: 0
    };

    snippets.map(snippet => ({
      ...snippet,
      order: snippet.order + 1
    }));

    const updatedSnippets: SnippetInterface[] = [newSnippet, ...snippets];

    try {
      const cloudSnippetId = await handleCreateCloudSnippet(newSnippet);
      if (cloudSnippetId) {
        newSnippet.cloudSnippetId = cloudSnippetId;
        setSnippets(updatedSnippets);
        setCurrentSnippetIndex(0);
      }
    } catch (error) {
      console.error('Error creating snippet in the cloud:', error);
    }
  };

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
