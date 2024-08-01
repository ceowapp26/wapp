import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/redux/features/apps/document/store';
import { useTranslation } from 'react-i18next';
import { Button, Textarea, Link, Tooltip } from '@nextui-org/react';
import { Prompt } from '@/types/prompt';
import { Plus, X, Trash2, SquareLibrary } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ImportPrompt from './import-prompt';
import ExportPrompt from './export-prompt';
import PopupModal from './popup-modal'; 
import { motion } from 'framer-motion';

const PromptLibraryButton = ({ onCloseModal, onOpen }) => {
  const { t } = useTranslation();
  
  const handleClick = () => {
    onCloseModal();
    onOpen();
  };

  return (
    <motion.button
      className="flex items-center px-8 py-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      aria-label={t('promptLibrary')}
    >
      <SquareLibrary className="w-5 h-5 mr-2" />
      <span className="font-medium mr-10">{t('promptLibrary')}</span>
    </motion.button>
  );
};

const PromptLibraryModal = ({ isOpen, onOpenChange, onClose }) => {
  const { t } = useTranslation();
  const setPrompts = useStore((state) => state.setPrompts);
  const prompts = useStore((state) => state.prompts);
  const [_prompts, _setPrompts] = useState(JSON.parse(JSON.stringify(prompts)));
  const container = useRef(null);

  const handleSave = () => {
    setPrompts(_prompts);
    onClose();
  };

  const addPrompt = () => {
    _setPrompts([..._prompts, { id: uuidv4(), name: '', prompt: '' }]);
  };

  const deletePrompt = (index) => {
    _setPrompts(_prompts.filter((_, i) => i !== index));
  };

  const clearPrompts = () => {
    _setPrompts([]);
  };

  useEffect(() => {
    _setPrompts(prompts);
  }, [prompts]);

  return (
    <PopupModal
      title={t('Prompt Library')}
      isModalOpen={isOpen}
      setIsModalOpen={onOpenChange}
      handleConfirm={handleSave}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-gray-50/75 gap-x-2 rounded-lg p-2">
          <ImportPrompt />
          <ExportPrompt />
        </div>
        
        <div className="flex space-x-4 pl-2">
          <Button
            color="success"
            variant="flat"
            startContent={<Plus size={18} />}
            onPress={addPrompt}
          >
            {t('Add Prompt')}
          </Button>
          <Button
            color="danger"
            variant="flat"
            startContent={<Trash2 size={18} />}
            onPress={clearPrompts}
          >
            {t('Clear All')}
          </Button>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner p-4 overflow-auto" ref={container}>
          <div className="grid grid-cols-12 gap-4 font-bold border-b-2 border-gray-200 dark:border-gray-600 pb-2 mb-4 bg-gray-100 dark:bg-gray-700 rounded-t-lg p-3 w-full">
            <div className="col-span-3 text-gray-700 dark:text-gray-300">{t('Name')}</div>
            <div className="col-span-7 text-gray-700 dark:text-gray-300">{t('Prompt')}</div>
            <div className="col-span-1 text-gray-700 dark:text-gray-300">{t('Action')}</div>
          </div>
          {_prompts.map((prompt, index) => (
            <div key={prompt.id} className="grid grid-cols-12 gap-4 items-center mb-4">
              <Textarea
                className="col-span-3 bg-transparent"
                value={prompt.name}
                onChange={(e) => {
                  const newPrompts = [..._prompts];
                  newPrompts[index].name = e.target.value;
                  _setPrompts(newPrompts);
                }}
                minRows={1}
                maxRows={3}
                placeholder={t('Enter name')}
              />
              <Textarea
                className="col-span-7 bg-transparent"
                value={prompt.prompt}
                onChange={(e) => {
                  const newPrompts = [..._prompts];
                  newPrompts[index].prompt = e.target.value;
                  _setPrompts(newPrompts);
                }}
                minRows={1}
                maxRows={3}
                placeholder={t('Enter prompt')}
              />
              <Tooltip content={t('Delete Prompt')}>
                <Button
                  isIconOnly
                  color="danger"
                  variant="light"
                  onPress={() => deletePrompt(index)}
                  className="col-span-1"
                >
                  <X size={18} />
                </Button>
              </Tooltip>
            </div>
          ))}
        </div>
        
        <p className="text-center text-gray-600 dark:text-gray-400">
          {t('Find more prompts at')}{' '}
          <Link
            href="https://github.com/f/awesome-chatgpt-prompts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            awesome-chatgpt-prompts
          </Link>
        </p>
      </div>
    </PopupModal>
  );
};

export { PromptLibraryButton, PromptLibraryModal };

