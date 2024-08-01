import React, { useState } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import BaseButton from './base-button';
import MarkdownIcon from '@/icons/MarkdownIcon';
import FileTextIcon from '@/icons/FileTextIcon';

const MarkdownModeButton = () => {
  const markdownMode = useStore((state) => state.markdownMode);
  const setMarkdownMode = useStore((state) => state.setMarkdownMode);

  return (
    <BaseButton
      icon={markdownMode ? <MarkdownIcon /> : <FileTextIcon />}
      buttonProps={{ 'aria-label': 'toggle markdown mode' }}
      onClick={() => {
        setMarkdownMode(!markdownMode);
      }}
    />
  );
};

export default MarkdownModeButton;