import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import {
  chatToMarkdown,
  downloadImg,
  downloadMarkdown,
  htmlToImg,
} from '@/utils/chat';
import PopupModal from './popup-modal';
import downloadFile from '@/utils/downloadFile';
import { Button, useDisclosure } from "@nextui-org/react";
import { Download, Image, FileText, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const DownloadChat = React.memo(({ saveRef }) => {
  const { t } = useTranslation();
  const downloadChatModal = useDisclosure();

  const downloadOptions = [
    {
      label: 'Image',
      icon: <Image className="w-6 h-6" />,
      onClick: async () => {
        if (saveRef?.current) {
          toast.promise(
            htmlToImg(saveRef.current).then(imgData => {
              const title = useDocumentStore.getState().chats?.[useDocumentStore.getState().currentChatIndex].title.trim() ?? 'download';
              downloadImg(imgData, `${title}.png`);
            }),
            {
              loading: 'Generating image...',
              success: 'Image downloaded successfully!',
              error: 'Failed to download image',
            }
          );
        }
      },
    },
    {
      label: 'Markdown',
      icon: <FileText className="w-6 h-6" />,
      onClick: async () => {
        const chats = useDocumentStore.getState().chats;
        if (chats && saveRef?.current) {
          toast.promise(
            Promise.resolve().then(() => {
              const markdown = chatToMarkdown(chats[useDocumentStore.getState().currentChatIndex]);
              const title = chats[useDocumentStore.getState().currentChatIndex].title.trim() ?? 'download';
              downloadMarkdown(markdown, `${title}.md`);
            }),
            {
              loading: 'Generating Markdown...',
              success: 'Markdown downloaded successfully!',
              error: 'Failed to download Markdown',
            }
          );
        }
      },
    },
    {
      label: 'JSON',
      icon: <Code className="w-6 h-6" />,
      onClick: async () => {
        const chats = useDocumentStore.getState().chats;
        if (chats) {
          toast.promise(
            Promise.resolve().then(() => {
              const chat = chats[useDocumentStore.getState().currentChatIndex];
              downloadFile([chat], chat.title);
            }),
            {
              loading: 'Generating JSON...',
              success: 'JSON downloaded successfully!',
              error: 'Failed to download JSON',
            }
          );
        }
      },
    },
  ];

  return (
    <>
      <Button
        auto
        color="primary"
        startContent={<Download size={20} />}
        onClick={downloadChatModal.onOpen}
        className="font-semibold"
      >
        {t('downloadChat')}
      </Button>
      <PopupModal
        isModalOpen={downloadChatModal.isOpen}
        setIsModalOpen={downloadChatModal.onOpenChange}
        title={t('downloadChat') as string}
        cancelButton={false}
      >
        <p className="text-lg text-gray-50/80 dark:text-gray-50/80 mb-4 ml-1">
          Select a format to download your chat:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AnimatePresence>
            {downloadOptions.map((option) => (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  auto
                  color="secondary"
                  startContent={option.icon}
                  onClick={() => {
                    option.onClick();
                    downloadChatModal.onClose();
                  }}
                  size="md"
                  className="w-full h-full py-6 text-md font-medium"
                >
                  {option.label}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </PopupModal>
    </>
  );
});

export default DownloadChat;
