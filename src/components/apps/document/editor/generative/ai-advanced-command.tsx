import React, { useEffect } from "react";
import { useEditor } from "../core/index";

export const AIAdvancedCommand = () => {
  const { editor } = useEditor();
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
   
  return null;
};
