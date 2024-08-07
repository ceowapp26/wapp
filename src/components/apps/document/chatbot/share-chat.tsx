import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PopupModal from './popup-modal';
import { useDocumentStore } from '@/stores/features/apps/document/store';
import { submitShareChat } from '@/api/api';
import { Share2 } from 'lucide-react';
import { useDisclosure, Button, Progress } from "@nextui-org/react";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ShareChat = React.memo(() => {
  const { t } = useTranslation();
  const shareChatModal= useDisclosure();
  const [isSharing, setIsSharing] = useState(false);
  const [shareProgress, setShareProgress] = useState(0);

  const handleConfirm = async () => {
    const chats = useDocumentStore.getState().chats;
    const currentChatIndex = useDocumentStore.getState().currentChatIndex;
    if (!chats) return;
    setIsSharing(true);
    try {
      const items = [];
      const messages = document.querySelectorAll('.share-gpt-message');
      messages.forEach((message, index) => {
        items.push({
          from: 'gpt',
          value: `<p><b>${t(chats[currentChatIndex].messages[index].role)}</b></p>${message.innerHTML}`,
        });
        setShareProgress((index + 1) / messages.length * 100);
      });
      await submitShareChat({ avatarUrl: '', items });
      shareChatModal.onClose();
      toast.success(t('postOnShareChat.success'));
    } catch (e) {
      console.error(e);
      toast.error(t('postOnShareChat.error'));
    } finally {
      setIsSharing(false);
      setShareProgress(0);
    }
  };

  return (
    <>
      <Button
        auto
        color="primary"
        startContent={<Share2 size={20} />}
        onClick={shareChatModal.onOpen}
        className="font-semibold"
      >
        {t('postOnShareChat.title')}
      </Button>
      <PopupModal
        isModalOpen={shareChatModal.isOpen}
        setIsModalOpen={shareChatModal.onClose}
        title={t('postOnShareChat.title')}
        message={t('postOnShareChat.warning')}
        handleConfirm={handleConfirm}
      >
        <div className="mt-4 gap-4 flex py-4">
          {/*<p>{t('postOnShareChat.warning')}</p>
          <p className="text-sm text-gray-500 mt-2">
            {t('postOnShareChat.description')}
          </p>*/}
          <AnimatePresence>
            {isSharing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Progress
                  value={shareProgress}
                  color="primary"
                  className="mt-4"
                  aria-label="Share progress"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <Button auto flat color="danger" onClick={shareChatModal.onClose}>
            {t('cancel')}
          </Button>
          <Button
            auto
            color="primary"
            onClick={handleConfirm}
            disabled={isSharing}
            className="relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isSharing ? (
                <motion.div
                  key="sharing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {t('postOnShareChat.sharing')}
                </motion.div>
              ) : (
                <motion.div
                  key="share"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {t('postOnShareChat.share')}
                </motion.div>
              )}
            </AnimatePresence>
            {!isSharing && (
              <motion.div
                className="absolute inset-0 bg-white opacity-20"
                initial={{ scale: 0, x: '100%' }}
                animate={{ scale: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Button>
        </div>
      </PopupModal>
    </>
  );
});

export default ShareChat;
