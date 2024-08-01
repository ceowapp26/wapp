"use client"
import { useEffect } from 'react';
import { useEditor } from '../core';
import { useStore } from '@/redux/features/apps/document/store';
import { TextSelection } from '@tiptap/pm/state';
import { useGeneralContext } from '@/context/general-context-provider';

export const DispatchEventEditor = () => {
  const { editor } = useEditor();
  const { contextContent, setContextContent } = useGeneralContext();
  const setInputContext = useStore((state) => state.setInputContext);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editor || !editor.state || !editor.state.selection) return;
      const { selection } = editor.state;
      if (selection instanceof TextSelection && !selection.empty) {
        const { from, to } = selection;
        const slice = editor.state.selection.content();
        const text = editor.storage.markdown.serializer.serialize(slice.content);
        setInputContext('selection');
        setContextContent(text);
      }
    };

    if (editor) {
      editor.on('selectionUpdate', handleSelectionChange);
      return () => {
        editor.off('selectionUpdate', handleSelectionChange);
      };
    }
  }, [editor]);

  return null;
};




