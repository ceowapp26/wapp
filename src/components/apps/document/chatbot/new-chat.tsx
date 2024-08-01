import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/redux/features/apps/document/store';
import PlusIcon from '@/icons/PlusIcon';
import { useAddChat } from '@/hooks/use-add-chat';

const NewChat = ({ folderId, cloudFolderId }: { folderId?: string, cloudFolderId?: string }) => {
  const { t } = useTranslation();
  const addChat = useAddChat();
  const generating = useStore((state) => state.generating);
  const isArchived = useStore((state) => state.archivedFolders[folderId]?.isArchived);

  if (isArchived) {
    return null;
  }
  
  return (
    <a
      className={`flex flex-1 items-center rounded-md hover:bg-gray-500/10 dark:hover:bg-slate-700 transition-all duration-200 text-black dark:text-white text-sm flex-shrink-0 ${
        generating
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer opacity-100'
      } ${
        folderId ? 'justify-start' : 'py-2 px-2 gap-3 mb-2 border dark:border-white border-black/20'
      }`}
      onClick={() => {
        if (!generating) addChat(folderId, cloudFolderId);
      }}
      title={folderId ? String(t('newChat')) : ''}
    >
      {folderId ? (
        <div className='max-h-0 parent-sibling-hover:max-h-10 hover:max-h-10 parent-sibling-hover:py-2 hover:py-2 px-2 overflow-hidden transition-all duration-200 delay-500 text-sm flex gap-3 items-center text-black dark:text-white dark:hover:bg-slate-700'>
          <PlusIcon /> {t('newChat')}
        </div>
      ) : (
        <>
          <PlusIcon />
          <span className='inline-flex text-black dark:text-white text-sm'>{t('newChat')}</span>
        </>
      )}
    </a>
  );
};

export default NewChat;


