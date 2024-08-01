import React from 'react';
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
  const renderNotification = () => {
    switch (type) {
      case 'popup':
        return <NotificationModal isOpen={isModalOpen} onClose={closeModal} notification={notification} />;
      case 'anchor':
        return <NotificationSnackbar open={isModalOpen} onClose={closeModal} notification={notification} />;
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
