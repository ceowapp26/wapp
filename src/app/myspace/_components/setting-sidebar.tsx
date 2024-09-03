"use client"
import React, { useState, useEffect } from "react";
import { useTheme } from 'next-themes';
import { Settings2, Menu, ChevronRight, Search, X, CircleHelp, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react'; 
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography'; 
import Button from '@mui/material/Button'; 
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from './search-bar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModelStore } from '@/stores/features/models/store';
import { useModelSettings } from "@/hooks/use-model-settings";
import { useTokenSettings } from "@/hooks/use-token-settings";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { BasicJoyrideWrapper, MultiRouteJoyrideWrapper, ControlledJoyrideWrapper, CustomJoyrideWrapper, CarouselJoyrideWrapper, ModalJoyrideWrapper, ScrollJoyrideWrapper } from "@/components/ui/joyride-wrapper";

const StyledCard = styled(Card)(({ theme, currentTheme }) => ({
  height: '100%',
  display: 'flex',
  paddingTop: '56px',
  flexDirection: 'column',
  backgroundColor: currentTheme === 'dark' ? '#121212' : theme.palette.background.default,
  color: currentTheme === 'dark' ? '#ffffff' : theme.palette.text.primary,
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

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SidebarItem = ({ icon: Icon, title, subtitle, onClick }) => {
  const { theme } = useTheme();
  return (
    <StyledButton
      fullWidth
      onClick={onClick}
      sx={{
        justifyContent: 'flex-start',
        padding: 2,
        marginBottom: 1,
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
  const { theme, setTheme } = useTheme();
  const { isRightSidebarOpened, rightSidebarType, setRightSidebarType, setIsRightSidebarOpened } = useMyspaceContext();

  const handleSidebar = (type) => {
    if (rightSidebarType !== type) setRightSidebarType(type);
    if (!isRightSidebarOpened) setIsRightSidebarOpened(true);
  };

  const handleSearch = (term) => {
    console.log("Searching for:", term);
  };

  return (
    <StyledCard currentTheme={theme}>
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
            <SidebarItem
              icon={CircleHelp}
              title="Technical Support"
              subtitle="App tour, supports, etc."
              onClick={() => handleSidebar("support-menu")}
            />
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </StyledCard>
  );
};
