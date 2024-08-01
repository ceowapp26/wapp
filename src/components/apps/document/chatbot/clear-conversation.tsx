import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PopupModal from './popup-modal';
import { Trash2 } from 'lucide-react';
import { useStore } from '@/redux/features/apps/document/store';
import { useInitializeNewChat } from '@/hooks/use-initialize-newchat';
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { motion } from 'framer-motion';

const ClearConversationModal = ({ isOpen, onOpenChange, onClose }: { isOpen: boolean; onOpenChange: () => void; onClose: () => void; }) => {
  const { t } = useTranslation();
  const removeAllChats = useMutation(api.chats.removeAllChats);
  const initializeNewChat = useInitializeNewChat();
  const setFolders = useStore((state) => state.setFolders);

  const handleConfirm = async () => {
    removeAllChats()
    initializeNewChat();
    setFolders({});
    onClose();
  };
  
  return (
    <PopupModal
      isModalOpen={isOpen}
      setIsModalOpen={onOpenChange}
      title={t('warning') as string}
      message={t('clearConversationWarning') as string}
      handleConfirm={handleConfirm}
    />
  );
};

const ClearConversationButton = ({ onCloseModal, onOpen }: { onCloseModal: () => void; onOpen: () => void; }) => {
  const { t } = useTranslation();
  const handleClick = () => {
    onCloseModal();
    onOpen();
  };
  return (
    <>
      <motion.button
        className="flex items-center px-9 py-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        aria-label={t('clearConversation')}
      >
        <Trash2 className="w-5 h-5 mr-2" />
        <span className="font-medium">Clear Conversation</span>
      </motion.button>
    </>
  );
};

export { ClearConversationButton, ClearConversationModal };

