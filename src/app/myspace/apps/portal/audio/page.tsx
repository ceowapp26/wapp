"use client"
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';
import { Grid, Container, useMediaQuery, ThemeProvider, createTheme, Button, Menu, MenuItem, IconButton, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AudioEditor from '../_components/audio-editor';
import { usePortalContext } from '@/context/portal-context-provider';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Chatbot = dynamic(() => import("../_components/chatbot"), {
  ssr: false,
});

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
  },
});

const StyledWrapper = styled('div')({
  maxHeight: '100vh',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fffbeb',
  overflowY: 'auto',
  position: 'relative',
  paddingTop: '10px',
  transition: 'all 0.3s ease',
});

const StyledContainer = styled(Container)(({ theme }) => ({
  color: theme.palette.text.primary,
  minHeight: '100vh',
  width: '100% !important', 
  maxWidth: '100% !important', 
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2) + ' !important', 
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4) + ' !important', 
  },
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  '& > .MuiGrid-item': {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ControlPanel = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
}));

const AudioPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const { portalContext, setPortalContext } = usePortalContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [layout, setLayout] = useState('two-column');
  const [showChatbot, setShowChatbot] = useState(true);
  const [showSwitchPortal, setShowSwitchPortal] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSendMessage = (userMessage, assistantMessage) => {
    const newMessage = { role: 'user', content: userMessage };
    const chatbotResponse = {
      id: uuidv4(),
      role: 'assistant',
      content: assistantMessage,
      context: portalContext,
    };
    setChatHistory(prev => [...prev, newMessage, chatbotResponse]);
    setPortalContext(chatbotResponse.context);
  };

  const handleLayoutMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLayoutMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
    handleLayoutMenuClose();
  };

  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  const toggleSwitchPortal = () => {
    setShowSwitchPortal(prev => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledWrapper>
        <StyledContainer>
          <ControlPanel>
            <Button
              variant="outlined"
              startIcon={<ViewColumnIcon />}
              onClick={handleLayoutMenuOpen}
            >
              Layout
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleLayoutMenuClose}
            >
              <MenuItem onClick={() => handleLayoutChange('one-column')}>One Column</MenuItem>
              <MenuItem onClick={() => handleLayoutChange('two-column')}>Two Columns</MenuItem>
            </Menu>
            <Tooltip title={showChatbot ? "Hide Chatbot" : "Show Chatbot"}>
              <IconButton onClick={toggleChatbot}>
                {showChatbot ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={showSwitchPortal ? "Hide Switch Portal" : "Show Switch Portal"}>
              <IconButton onClick={toggleSwitchPortal}>
                {showSwitchPortal ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Tooltip>
          </ControlPanel>
          <StyledGrid container spacing={3} className={layout === "one-column" ? "flex-col" : "flex-row"}>
            <AnimatePresence>
              {showChatbot && (
                <Grid item xs={12} md={layout === 'one-column' ? 12 : 6} key="chatbot-grid">
                  <motion.div
                    key="chatbot-motion"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Chatbot chatHistory={chatHistory} onSendMessage={handleSendMessage} portalContext={portalContext} />
                  </motion.div>
                </Grid>
              )}
              {showSwitchPortal && (
                <Grid item xs={12} md={layout === 'one-column' ? 12 : 6} key="switchportal-grid">
                  <motion.div
                    key="switchportal-motion"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AudioEditor chatHistory={chatHistory} layout={layout} />;
                  </motion.div>
                </Grid>
              )}
            </AnimatePresence>
          </StyledGrid>
        </StyledContainer>
      </StyledWrapper>
    </ThemeProvider>
  );
};

export default AudioPage;


