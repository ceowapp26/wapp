import React from 'react';
import dynamic from 'next/dynamic';
import TextEditor from './text-editor';
import ImageEditor from './image-editor';
import AudioEditor from './audio-editor';
import VideoEditor from './video-editor';

const CodeEditor = dynamic(() => import('./code-editor'), { ssr: false });

interface SwitchPortalProps {
  context: 'TEXT' | 'CODE' | 'IMAGE' | 'AUDIO' | 'VIDEO';
  layout?: "one-column" | "two-column";
  aiResponse?: string;
  chatHistory?: Array<{ role: string; content: string; context?: any }>;
}

const SwitchPortal: React.FC<SwitchPortalProps> = ({ context, aiResponse, chatHistory, layout }) => {
  const renderPortal = () => {
    switch (context) {
      case 'TEXT':
        return <TextEditor initialContent={aiResponse} />;
      case 'CODE':
        return <CodeEditor initialContent={aiResponse} />;
      case 'IMAGE':
        return <ImageEditor initialContent={aiResponse} />;
      case 'AUDIO':
        return <AudioEditor chatHistory={chatHistory} layout={layout} />;
      case 'VIDEO':
      default:
        return <VideoEditor initialContent={aiResponse} />;
    }
  };

  return <div>{renderPortal()}</div>;
};

export default SwitchPortal;
