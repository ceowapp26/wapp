import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';

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
  bottom: 24,
  left: '5%',
  transform: 'translateX(-50%)',
  zIndex: 9999,
  minWidth: 300,
  maxWidth: '90%',
  backgroundColor: '#ffffff',
  borderRadius: 12,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    minWidth: 400,
  },
}));

const SnackbarContent = styled('div')<{ type: string }>(({ type, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  backgroundColor:
    type === 'success' ? theme.palette.success.light :
    type === 'info' ? theme.palette.info.light :
    type === 'warning' ? theme.palette.warning.light :
    type === 'error' ? theme.palette.error.light : theme.palette.info.light,
}));

const IconContainer = styled('div')<{ type: string }>(({ type, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  marginRight: 16,
  backgroundColor:
    type === 'success' ? theme.palette.success.main :
    type === 'info' ? theme.palette.info.main :
    type === 'warning' ? theme.palette.warning.main :
    type === 'error' ? theme.palette.error.main : theme.palette.info.main,
  color: '#ffffff',
}));

const Message = styled(Typography)({
  flexGrow: 1,
  marginRight: 16,
  color: '#333333',
});

const CloseButton = styled(IconButton)({
  color: '#666666',
  padding: 8,
});

const NotificationSnackbar = ({ open, onClose, notification }: NotificationSnackbarProps) => {
  const { content, type = 'info' } = notification;

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 30000); 

      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'info':
        return 'i';
      case 'warning':
        return '!';
      case 'error':
        return '×';
      default:
        return 'i';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <SnackbarContainer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <SnackbarContent type={type}>
            <IconContainer type={type}>
              {getIcon(type)}
            </IconContainer>
            <Message variant="body1">{content}</Message>
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