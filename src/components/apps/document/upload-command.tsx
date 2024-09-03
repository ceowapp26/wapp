import React, { useEffect } from "react";
import { CommandGroup, CommandItem, CommandSeparator, CommandList } from "../ui/command";
import { useEditor } from "../core/index";
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { Check, TextQuote, TrashIcon } from "lucide-react";

export const AIBasicCommand = () => {
  const { editor } = useEditor();
  const setReplaceAI = useDocumentStore((state) => state.setReplaceAI);
  const setInsertAboveAI = useDocumentStore((state) => state.setInsertAboveAI);
  const setInsertBelowAI = useDocumentStore((state) => state.setInsertBelowAI);
  const setInsertLeftAI = useDocumentStore((state) => state.setInsertLeftAI);
  const setInsertRightAI = useDocumentStore((state) => state.setInsertRightAI);

  useEffect(() => {
    const replace = (content) => {
      const selection = editor.view.state.selection;
      editor
        .chain()
        .focus()
        .insertContentAt(
          {
            from: selection.from,
            to: selection.to,
          },
          content,
        )
        .run();
    }

    const insertLeft = (content) => {
      const selection = editor.view.state.selection;
      const endPos = selection.$to.pos;
      editor
        .chain()
        .focus()
        .insertContentAt(endPos, ` ${content}`)
        .run();
    }

    const insertRight = (content) => {
      const selection = editor.view.state.selection;
      const startPos = selection.$from.pos;
      editor
        .chain()
        .focus()
        .insertContentAt(startPos, ` ${content}`)
        .run();
    }

    const insertAbove = (content) => {
      const selection = editor.view.state.selection;
      editor
        .chain()
        .focus()
        .insertContentAt(selection.to - 1, content)
        .run();
    }

    const insertBelow = (content) => {
      const selection = editor.view.state.selection;
      editor
        .chain()
        .focus()
        .insertContentAt(selection.to + 1, content)
        .run();
    }

    setReplaceAI(replace);
    setInsertLeftAI(insertLeft);
    setInsertRightAI(insertRight);
    setInsertAboveAI(insertAbove);
    setInsertBelowAI(insertBelow);
  }, [editor, setReplaceAI, setInsertAboveAI, setInsertBelowAI, setInsertLeftAI, setInsertRightAI]);

  return null;
};
