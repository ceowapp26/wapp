import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/redux/features/apps/document/store';
import PopupModal from './popup-modal';
import { submitShareChat } from '@/api/api';
import { ShareChatSubmitBodyInterface } from '@/types/chat';
import { SquareArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

const ShareChat = React.memo(() => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  const handleConfirm = async () => {
    const chats = useStore.getState().chats;
    const currentChatIndex = useStore.getState().currentChatIndex;
    if (!chats) return;

    setIsSharing(true);
    try {
      const items: ShareChatSubmitBodyInterface['items'] = [];
      const messages = document.querySelectorAll('.share-gpt-message');
      messages.forEach((message, index) => {
        items.push({
          from: 'gpt',
          value: `<p><b>${t(chats[currentChatIndex].messages[index].role)}</b></p>${message.innerHTML}`,
        });
      });
      await submitShareChat({
        avatarUrl: '',
        items,
      });
      setIsModalOpen(false);
      toast.success(t('postOnShareChat.success'));
    } catch (e: unknown) {
      console.error(e);
      toast.error(t('postOnShareChat.error'));
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        onClick={() => setIsModalOpen(true)}
        aria-label={t('postOnShareChat.title')}
      >
        <SquareArrowUpRight className="w-5 h-5 mr-2" />
        {t('postOnShareChat.title')}
      </button>
      {isModalOpen && (
        <PopupModal
          setIsModalOpen={setIsModalOpen}
          title={t('postOnShareChat.title')}
          message={t('postOnShareChat.warning')}
          handleConfirm={handleConfirm}
        >
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              {t('postOnShareChat.description')}
            </p>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${
                isSharing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleConfirm}
              disabled={isSharing}
            >
              {isSharing ? t('postOnShareChat.sharing') : t('postOnShareChat.share')}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              onClick={() => setIsModalOpen(false)}
            >
              {t('cancel')}
            </button>
          </div>
        </PopupModal>
      )}
    </>
  );
});

export default ShareChat;