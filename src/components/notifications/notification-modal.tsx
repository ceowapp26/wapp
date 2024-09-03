import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box, IconButton } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    title: string;
    content: string;
    type?: 'info' | 'success' | 'warning' | 'error';
  };
}

const Backdrop = styled(motion.div)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
});

const ModalContent = styled(motion.div)(({ theme }) => ({
  width: '90%',
  maxWidth: 400,
  backgroundColor: '#ffffff',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  borderRadius: '16px',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    width: 400,
  },
}));

const StyledIconButton = styled(motion(IconButton))({
  position: 'absolute',
  right: 8,
  top: 8,
  color: '#9e9e9e',
});

const StyledTitle = styled(Typography)<{ type: string }>(({ type, theme }) => ({
  fontWeight: 600,
  marginBottom: '16px',
  color: type === 'info' ? theme.palette.info.main :
         type === 'success' ? theme.palette.success.main :
         type === 'warning' ? theme.palette.warning.main :
         type === 'error' ? theme.palette.error.main : theme.palette.info.main,
}));

const ContentWrapper = styled(Box)({
  maxHeight: '60vh',
  overflowY: 'auto',
  marginBottom: '16px',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#c1c1c1',
    borderRadius: '4px',
  },
});

const NotificationModal = ({ isOpen, onClose, notification }: NotificationModalProps) => {
  const { title, content, type = 'info' } = notification;

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          >
            <StyledIconButton
              aria-label="close"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseIcon />
            </StyledIconButton>
            <StyledTitle variant="h5" component="h2" type={type}>
              {title}
            </StyledTitle>
            <ContentWrapper>
              <Typography variant="body1">
                {content}
              </Typography>
            </ContentWrapper>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={onClose}
                  sx={{
                    backgroundColor: type === 'info' ? '#e3f2fd' :
                                     type === 'success' ? '#e8f5e9' :
                                     type === 'warning' ? '#fff3e0' :
                                     type === 'error' ? '#ffebee' : '#e3f2fd',
                    color: type === 'info' ? '#2196f3' :
                           type === 'success' ? '#4caf50' :
                           type === 'warning' ? '#ff9800' :
                           type === 'error' ? '#f44336' : '#2196f3',
                    '&:hover': {
                      backgroundColor: type === 'info' ? '#bbdefb' :
                                       type === 'success' ? '#c8e6c9' :
                                       type === 'warning' ? '#ffe0b2' :
                                       type === 'error' ? '#ffcdd2' : '#bbdefb',
                    }
                  }}
                >
                  <NotificationsActiveIcon />
                </IconButton>
              </motion.div>
            </Box>
          </ModalContent>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;