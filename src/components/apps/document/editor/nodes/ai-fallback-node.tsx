import React from 'react';
import { NodeViewWrapper } from "@tiptap/react";

export const AIFallbackNode: React.FC = ({ data }) => {
  return (
    <NodeViewWrapper>
      <h1 className="text-xl font-bold text-center text-blue-600 my-8">{data}</h1>
    </NodeViewWrapper>
  );
}
