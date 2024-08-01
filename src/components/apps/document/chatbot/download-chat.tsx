import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PopupModal from './popup-modal';
import {
  chatToMarkdown,
  downloadImg,
  downloadMarkdown,
  htmlToImg,
} from '@/utils/chat';
import ImageIcon from '@/icons/ImageIcon';
import MarkdownIcon from '@/icons/MarkdownIcon';
import JsonIcon from '@/icons/JsonIcon';
import downloadFile from '@/utils/downloadFile';

const DownloadChat = React.memo(({ saveRef }: { saveRef: React.RefObject<HTMLDivElement> }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const downloadOptions = [
    {
      label: 'Image',
      icon: <ImageIcon className="w-5 h-5" />,
      onClick: async () => {
        if (saveRef?.current) {
          const imgData = await htmlToImg(saveRef.current);
          downloadImg(imgData, `${useStore.getState().chats?.[useStore.getState().currentChatIndex].title.trim() ?? 'download'}.png`);
        }
      },
    },
    {
      label: 'Markdown',
      icon: <MarkdownIcon className="w-5 h-5" />,
      onClick: async () => {
        const chats = useStore.getState().chats;
        if (chats && saveRef?.current) {
          const markdown = chatToMarkdown(chats[useStore.getState().currentChatIndex]);
          downloadMarkdown(markdown, `${chats[useStore.getState().currentChatIndex].title.trim() ?? 'download'}.md`);
        }
      },
    },
    {
      label: 'JSON',
      icon: <JsonIcon className="w-5 h-5" />,
      onClick: async () => {
        const chats = useStore.getState().chats;
        if (chats) {
          const chat = chats[useStore.getState().currentChatIndex];
          downloadFile([chat], chat.title);
        }
      },
    },
  ];

  return (
    <>
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        aria-label={t('downloadChat') as string}
        onClick={() => setIsModalOpen(true)}
      >
        {t('downloadChat')}
      </button>
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('downloadChat') as string}
          cancelButton={false}
        >
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a format to download your chat:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {downloadOptions.map((option) => (
                <button
                  key={option.label}
                  className="flex items-center justify-center p-4 space-x-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={option.onClick}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </PopupModal>
      )}
    </>
  );
});

export default DownloadChat;