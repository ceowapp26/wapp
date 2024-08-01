import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import { useTranslation } from 'react-i18next';
import { matchSorter } from 'match-sorter';
import { Prompt } from '@/types/prompt';
import { useHideOnOutsideClick } from '@/hooks/use-hideon-outside-click';
import { Search, Command } from 'lucide-react';

const CommandPrompt = ({
  _setContent,
  setCharacterCount,
}: {
  _setContent: React.Dispatch<React.SetStateAction<string>>;
  setCharacterCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { t } = useTranslation();
  const prompts = useStore((state) => state.prompts);
  const [_prompts, _setPrompts] = useState(prompts);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

  useEffect(() => {
    if (dropDown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [dropDown]);

  useEffect(() => {
    const filteredPrompts = matchSorter(useStore.getState().prompts, input, {
      keys: ['name'],
    });
    _setPrompts(filteredPrompts);
  }, [input]);

  useEffect(() => {
    _setPrompts(prompts);
    setInput('');
  }, [prompts]);

  return (
    <div className='relative' ref={dropDownRef}>
      <button
        className='p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200'
        aria-label='prompt library'
        onClick={() => setDropDown(!dropDown)}
      >
        <Command size={18} className="text-gray-600 dark:text-gray-300" />
      </button>
      {dropDown && (
        <div className='absolute top-full mt-2 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
          <div className='px-4 py-3 bg-gray-100 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='text-sm font-medium text-gray-700 dark:text-gray-200'>{t('promptLibrary')}</h3>
          </div>
          <div className='p-2'>
            <div className='relative'>
              <input
                ref={inputRef}
                type='text'
                className='w-full px-3 py-2 pl-10 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent'
                value={input}
                placeholder={t('search')}
                onChange={(e) => setInput(e.target.value)}
              />
              <Search size={18} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            </div>
          </div>
          <ul className='max-h-60 overflow-y-auto'>
            {_prompts.map((cp) => (
              <li
                key={cp.id}
                className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150'
                onClick={() => {
                  _setContent((prev) => prev + cp.prompt);
                  setCharacterCount(cp.prompt.trim().length);
                  setDropDown(false);
                }}
              >
                <p className='text-sm text-gray-700 dark:text-gray-200'>{cp.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommandPrompt;