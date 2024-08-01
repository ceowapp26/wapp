import React, { useState } from 'react';
import { useStore } from '@/redux/features/apps/document/store';

const CharacterCount: React.FC<{ numofCharacter: number }> = ({ numofCharacter }) => {
  const inputModel = useStore((state) => state.inputModel);
  const AIConfig = useStore((state) => state.AIConfig);
  const MAX_WORDS = AIConfig[inputModel].max_tokens * 4;

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