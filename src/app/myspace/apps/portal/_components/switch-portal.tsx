import React from 'react';
import dynamic from 'next/dynamic';
import TextEditor from './text-editor';
import ImageEditor from './image-editor';
import VideoEditor from './video-editor';
const CodeEditor = dynamic(() => import('./code-editor'), { ssr: false });

const SwitchPortal = ({ context, aiResponse }) => {
  const renderPortal = () => {
    switch (context) {
      case 'TEXT':
        return <TextEditor initialContent={aiResponse} />;
      case 'CODE':
        return <CodeEditor initialContent={aiResponse} />;
      case 'IMAGE':
        return <ImageEditor initialContent={aiResponse} />;
      case 'VIDEO':
      default:
        return <VideoEditor initialContent={aiResponse} />;
    }
  };

  return <div>{renderPortal()}</div>;
};

export default SwitchPortal;
