"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useEdgeStore } from '@/lib/edgestore';
import WappEditor from './editor/wapp-editor';
import { JSONContent } from "novel";

interface EditorProps {
  onChange: (value: string) => void;
  id?: string;
  documentTitle?: string;
  initialContent?: string;
}

const Editor = ({onChange, id, documentTitle, initialContent}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  return (
    <React.Fragment>
      <WappEditor onChange={onChange} id={id} documentTitle={documentTitle} initialContent={initialContent} />
    </React.Fragment>
  );
};

export default Editor;






























