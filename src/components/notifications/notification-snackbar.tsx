import React from 'react';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

interface NotificationSnackbarProps {
  open: boolean;
  onClose: () => void;
  notification: {
    content: string;
    type?: 'success' | 'info' | 'warning' | 'error';
  };
}

const SnackbarContainer = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  minWidth: 300,
  maxWidth: '90%',
  backgroundColor: '#ffffff',
  borderRadius: 8,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const SnackbarContent = styled('div')<{ type: string }>(({ type }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  backgroundColor:
    type === 'success' ? '#4caf50' :
    type === 'info' ? '#2196f3' :
    type === 'warning' ? '#ff9800' :
    type === 'error' ? '#f44336' : '#4caf50',
  color: '#ffffff',
}));

const Message = styled('p')({
  margin: 0,
  flexGrow: 1,
  fontSize: '1rem',
});

const CloseButton = styled(IconButton)({
  color: '#ffffff',
  padding: 8,
});

const NotificationSnackbar = ({ open, onClose, notification }: NotificationSnackbarProps) => {
  const { content, type = 'success' } = notification;

  return (
    <AnimatePresence>
      {open && (
        <SnackbarContainer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        >
          <SnackbarContent type={type}>
            <Message>{content}</Message>
            <CloseButton
              aria-label="close"
              onClick={onClose}
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseIcon />
            </CloseButton>
          </SnackbarContent>
        </SnackbarContainer>
      )}
    </AnimatePresence>
  );
};

export default NotificationSnackbar;