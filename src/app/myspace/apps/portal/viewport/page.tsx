"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Grid, Container, useMediaQuery, ThemeProvider, createTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SwitchPortal from '../_components/switch-portal';
import { usePortalContextHook } from '@/context/portal-context-provider';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';

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
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fffbeb',
  overflowY: 'auto',
  paddingTop: '250px',
  position: 'relative',
  transition: 'all 0.3s ease',
});

const StyledContainer = styled(Container)(({ theme }) => ({
  color: theme.palette.text.primary,
  minHeight: '100vh',
  display: 'flex',
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  height: '100%',
  '& > .MuiGrid-item': {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const PortalViewportPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const { portalContext, setPortalContext } = usePortalContextHook();
  const { setLeftSidebarWidth, setRightSidebarWidth, isAppbarCollapsed } = useMyspaceContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setLeftSidebarWidth(0);
    setRightSidebarWidth(0);
  }, []); 

  const handleSendMessage = (userMessage, assistantMessage) => {
    const newMessage = { role: 'user', content: userMessage };
    const chatbotResponse = {
      role: 'assistant',
      content: assistantMessage,
      context: portalContext,
    };
    setChatHistory(prev => [...prev, newMessage, chatbotResponse]);
    setPortalContext(chatbotResponse.context);
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledWrapper>
        <StyledContainer maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={portalContext}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Chatbot chatHistory={chatHistory} onSendMessage={handleSendMessage} portalContext={portalContext} />
                </motion.div>
              </AnimatePresence>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SwitchPortal context={portalContext} aiResponse={chatHistory[chatHistory.length - 1]?.content} />
              </motion.div>
            </Grid>
          </Grid>
        </StyledContainer>
      </StyledWrapper>
    </ThemeProvider>
  );
};

export default PortalViewportPage;