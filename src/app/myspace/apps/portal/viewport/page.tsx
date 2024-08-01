"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Grid, Container } from '@mui/material';
import SwitchPortal from '../_components/switch-portal';
import { usePortalContextHook } from '@/context/portal-context-provider';
import { useMyspaceContext } from "@/context/myspace-context-provider";

const Chatbot = dynamic(() => import("../_components/chatbot"), {
  ssr: false,
});

const PortalViewportPage = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const { portalContext, setPortalContext } = usePortalContextHook();
  const { setLeftSidebarWidth, setRightSidebarWidth, isAppbarCollapsed } = useMyspaceContext();

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
    setChatHistory([...chatHistory, newMessage, chatbotResponse]);
    setPortalContext(chatbotResponse.context);
  };

  return (
    <Container className={`relative flex flex-1 h-screen max-h-screen overflow-y-auto ${isAppbarCollapsed ? 'top-48' : 'top-48'}`}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Chatbot chatHistory={chatHistory} onSendMessage={handleSendMessage} portalContext={portalContext} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SwitchPortal context={portalContext} aiResponse={chatHistory[chatHistory.length - 1]?.content} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PortalViewportPage;
