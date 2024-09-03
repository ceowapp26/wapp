import React, { useState, useEffect } from 'react';
import NotificationModal from './notification-modal';
import NotificationSnackbar from './notification-snackbar';

interface NotificationWrapperProps {
  isModalOpen: boolean;
  closeModal: () => void;
  type: string;
  notification: {
    title: string;
    content: string;
  };
}

const NotificationWrapper = ({ isModalOpen, closeModal, type, notification }: NotificationWrapperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      setIsOpen(true);
    }
  }, [isModalOpen]);

  const handleClose = () => {
    setIsOpen(false);
    closeModal();
  };

  const renderNotification = () => {
    switch (type) {
      case 'popup':
        return <NotificationModal isOpen={isOpen} onClose={handleClose} notification={notification} />;
      case 'anchor':
        return <NotificationSnackbar open={isOpen} onClose={handleClose} notification={notification} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderNotification()}
    </div>
  );
};

export default NotificationWrapper;