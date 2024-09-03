import React, { useState } from 'react';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { useModelStore } from '@/stores/features/models/store';

const CharacterCount: React.FC<{ numofCharacter: number }> = ({ numofCharacter }) => {
  const chatModel = useDocumentStore((state) => state.chatModel);
  const AIConfig = useModelStore((state) => state.AIConfig);
  const MAX_WORDS = AIConfig[chatModel].max_tokens * 4;

  const isPromptValid = () => {
    return numofCharacter <= MAX_WORDS;
  };

  return (
    <div className="absolute right-32 bottom-1 flex items-center">
      <span className={`text-tiny ${isPromptValid() ? 'text-default-400' : 'text-danger'}`}>
        {numofCharacter} / {MAX_WORDS}
      </span>
    </div>
  );
};

export default CharacterCount;