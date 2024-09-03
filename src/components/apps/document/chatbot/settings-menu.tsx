import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDisclosure } from "@nextui-org/react";
import PopupModal from './popup-modal';
import { SlidersHorizontal } from 'lucide-react';
import AutoTitleToggle from './auto-title-toggle';
import AdvancedModeToggle from './advanced-mode-toggle';
import InlineLatexToggle from './inline-latex-toggle';
import EnterToSubmitToggle from './enter-to-submit-toggle';
import { ClearConversationButton, ClearConversationModal } from './clear-conversation';
import { PromptLibraryButton, PromptLibraryModal } from './prompt-library-menu';
import { ChatConfigButton, ChatConfigModal } from './chat-config-menu';

const SettingsMenu = () => {
  const { t } = useTranslation();
  const settingModal = useDisclosure();
  const clearConversationModal = useDisclosure();
  const promptLibraryModal = useDisclosure();
  const chatConfigModal = useDisclosure();

  return (
    <>
      <button
        className='flex items-center w-full gap-4 px-4 py-4 text-md font-medium text-gray-700 bg-gray-400 rounded-md shadow-sm hover:bg-gray-500 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-200 mb-2'
        onClick={settingModal.onOpen}
      >
        <SlidersHorizontal className='w-5 h-5' />
        {t('setting')}
      </button>
      <PopupModal
        isModalOpen={settingModal.isOpen}
        setIsModalOpen={settingModal.onOpenChange}
        title={t('setting') as string}
        cancelButton={false}
      >
        <div className='p-6 border-b border-gray-200 dark:border-gray-600 flex flex-col items-center gap-4'>
          <div className='flex flex-col gap-3'>
            <EnterToSubmitToggle />
            <InlineLatexToggle />
            <AdvancedModeToggle />
          </div>
          <ClearConversationButton onCloseModal={settingModal.onClose} onOpen={clearConversationModal.onOpen} />
          <PromptLibraryButton onCloseModal={settingModal.onClose} onOpen={promptLibraryModal.onOpen} />
          <ChatConfigButton onCloseModal={settingModal.onClose} onOpen={chatConfigModal.onOpen} />
        </div>
      </PopupModal>
      <ClearConversationModal isOpen={clearConversationModal.isOpen} onOpenChange={clearConversationModal.onOpenChange} onClose={clearConversationModal.onClose} />
      <PromptLibraryModal isOpen={promptLibraryModal.isOpen} onOpenChange={promptLibraryModal.onOpenChange} onClose={promptLibraryModal.onClose} />
      <ChatConfigModal isOpen={chatConfigModal.isOpen} onOpenChange={chatConfigModal.onOpenChange} onClose={chatConfigModal.onClose} />
    </>
  );
};

export default SettingsMenu;

