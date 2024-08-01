"use client"
import React, { useState } from "react";
import { Settings2, Menu, ChevronRight, Search, X } from 'lucide-react'; 
import { styled, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography'; 
import Button from '@mui/material/Button'; 
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from './search-bar';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  paddingTop: '56px',
  flexDirection: 'column',
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[10],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateY(-2px)',
  },
}));


const SidebarItem = ({ icon: Icon, title, subtitle, onClick }) => {
  const theme = useTheme();
  return (
    <StyledButton
      fullWidth
      onClick={onClick}
      sx={{
        justifyContent: 'flex-start',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1),
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" width="100%">
        <Icon size={24} />
        <Box flexGrow={1}>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        </Box>
        <ChevronRight size={20} />
      </Stack>
    </StyledButton>
  );
};

export const SettingSidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isRightSidebarOpened, rightSidebarType, setRightSidebarType, setIsRightSidebarOpened } = useMyspaceContext();

  const handleSidebar = (type) => {
    if (rightSidebarType !== type) setRightSidebarType(type);
    if (!isRightSidebarOpened) setIsRightSidebarOpened(true);
  };

  const handleSearch = (term) => {
    console.log("Searching for:", term);
  };

  return (
    <StyledCard>
      <CardHeader 
        title="Settings" 
        titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
      />
      <CardContent>
        <SearchBar onSearch={handleSearch} />
        <Box my={2}>
          <Divider />
        </Box>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SidebarItem
              icon={Settings2}
              title="General Settings"
              subtitle="Language, theme, etc."
              onClick={() => handleSidebar("general-setting")}
            />
            <SidebarItem
              icon={Menu}
              title="General Menu"
              subtitle="App, extensions, etc."
              onClick={() => handleSidebar("general-menu")}
            />
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </StyledCard>
  );
};