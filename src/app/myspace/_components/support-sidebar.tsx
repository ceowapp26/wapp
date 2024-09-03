import React, { useMemo, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { usePathname } from 'next/navigation';
import { useModelStore } from '@/stores/features/models/store';
import { useModelSettings } from "@/hooks/use-model-settings";
import { useTokenSettings } from "@/hooks/use-token-settings";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { BasicJoyrideWrapper, MultiRouteJoyrideWrapper, ControlledJoyrideWrapper, CustomJoyrideWrapper, CarouselJoyrideWrapper, ModalJoyrideWrapper, ScrollJoyrideWrapper } from "@/components/ui/joyride-wrapper";

const StyledCard = styled(Card)(({ theme, currentTheme }) => ({
  height: '100%',
  display: 'flex',
  padding: '64px 14px 0 14px',
  overflowY: 'auto',
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
  textTransform: 'non4',
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

const SupportPageLink = () => {
  const { theme } = useTheme();

  return (
    <Link href="/support" passHref>
      <motion.div
        className={`
          inline-flex items-center justify-between
          w-full px-4 py-2 text-sm font-medium
          rounded-lg transition-colors duration-300
          ${theme === 'dark' 
            ? 'bg-gray-800 text-white hover:bg-gray-700' 
            : 'bg-white text-gray-900 hover:bg-gray-100'}
          border border-transparent hover:border-gray-300
          shadow-sm hover:shadow-md
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Support Page</span>
        <motion.div
          initial={{ x: -5, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
        </motion.div>
      </motion.div>
    </Link>
  );
};

const routes = {
  '/myspace/apps/document': [  
    {
      target: '.wapp-sidebar', 
      content: 'This is wapp-sidebar',
    },
  ],
};

export const DocumentTourSteps = [
  {
    target: '.wapp-sidebar', 
    content: 'This is wapp-sidebar',
    placement: 'top',
  },
  {
    target: '.wapp-editor', 
    content: 'This is wapp-editor',
  },
];

export const SupportSidebar = () => {
  const SMALL_SCREEN_THRESHOLD = 480;
  const { theme, setTheme } = useTheme();
  const currentPath = usePathname();
  const { setRightSidebarType, rightSidebarWidth } = useMyspaceContext();
  const [expanded, setExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    setIsSmallScreen(rightSidebarWidth < SMALL_SCREEN_THRESHOLD);
  }, [rightSidebarWidth]);

  const handleReturnBack = () => {
    setRightSidebarType("general");
  };

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledCard elevation={3} currentTheme={theme}>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <IconButton onClick={handleReturnBack} size="small" className="dark:text-gray-100">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">Support</Typography>
          <Box width={24} />
        </Stack>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List disablePadding>
        <StyledListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <ListItemText primary="App Tours" secondary="Explore different tour options" />
          <Box mt={2} width="100%">
            <Accordion expanded={expanded} onChange={handleAccordionChange}>
              <AccordionSummary
                expandIcon={expanded ? <ChevronUp /> : <ChevronDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Tour Options</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <BasicJoyrideWrapper steps={DocumentTourSteps} />
                  <MultiRouteJoyrideWrapper routes={routes} />
                  <ControlledJoyrideWrapper steps={DocumentTourSteps} />
                  <CustomJoyrideWrapper steps={DocumentTourSteps} />
                  <CarouselJoyrideWrapper steps={DocumentTourSteps} />
                  <ModalJoyrideWrapper steps={DocumentTourSteps} />
                  <ScrollJoyrideWrapper steps={DocumentTourSteps} />
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
        </StyledListItem>
        <StyledListItem sx={{ flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'flex-start' : 'center' }}>
          <SupportPageLink />
        </StyledListItem>
      </List>
    </StyledCard>
  );
}


