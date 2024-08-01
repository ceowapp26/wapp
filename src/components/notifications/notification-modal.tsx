import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box, Button, IconButton } from '@mui/material';
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

const ModalContent = styled(motion.div)({
  width: 400,
  backgroundColor: '#ffffff',
  boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
  borderRadius: '8px',
  padding: '32px',
  position: 'relative',
});

const StyledIconButton = styled(motion(IconButton))({
  position: 'absolute',
  right: 8,
  top: 8,
  color: '#9e9e9e',
});

const StyledTitle = styled(Typography)<{ type: string }>(({ type }) => ({
  color: type === 'info' ? '#2196f3' :
         type === 'success' ? '#4caf50' :
         type === 'warning' ? '#ff9800' :
         type === 'error' ? '#f44336' : '#2196f3',
}));

const NotificationModal = ({ isOpen, onClose, notification }: NotificationModalProps) => {
  const { title, content, type = 'info' } = notification;

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
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
            <StyledTitle variant="h5" component="h2" gutterBottom type={type}>
              {title}
            </StyledTitle>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {content}
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="contained" 
                  onClick={onClose} 
                  sx={{
                    backgroundColor: 
                      type === 'info' ? '#2196f3' :
                      type === 'success' ? '#4caf50' :
                      type === 'warning' ? '#ff9800' :
                      type === 'error' ? '#f44336' : '#2196f3',
                    '&:hover': {
                      backgroundColor: 
                        type === 'info' ? '#1976d2' :
                        type === 'success' ? '#43a047' :
                        type === 'warning' ? '#f57c00' :
                        type === 'error' ? '#d32f2f' : '#1976d2',
                    }
                  }}
                >
                  Close
                </Button>
              </motion.div>
            </Box>
          </ModalContent>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;