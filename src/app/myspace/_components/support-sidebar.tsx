import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { styled, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModelStore } from '@/stores/features/models/store';
import { useModelSettings } from "@/hooks/use-model-settings";
import { useTokenSettings } from "@/hooks/use-token-settings";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { BasicJoyrideWrapper, MultiRouteJoyrideWrapper, ControlledJoyrideWrapper, CustomJoyrideWrapper, CarouselJoyrideWrapper, ModalJoyrideWrapper, ScrollJoyrideWrapper } from "@/components/ui/joyride-wrapper";

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

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  height: '100%',
  paddingTop: "48px",
  overflowY: "auto",
  backgroundColor: theme.palette.background.default,
  transition: 'background-color 0.3s ease',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  minWidth: "128px",
  padding: '4px 8px',
  fontSize: '0.8rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
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

export const SupportSidebar = () => {
  const SMALL_SCREEN_THRESHOLD = 480;
  const theme = useTheme();
  const currentPath = usePathname();
  const { setRightSidebarType, rightSidebarWidth } = useMyspaceContext();
  const isSmallScreen = useMemo(() => rightSidebarWidth < SMALL_SCREEN_THRESHOLD, [rightSidebarWidth]);
  const [expanded, setExpanded] = useState(false);

  const handleReturnBack = () => {
    setRightSidebarType("general");
  };

  const handleAccordionChange = () => {
    setExpanded(!expanded);
  };

  return (
    <StyledCard elevation={3}>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <IconButton onClick={handleReturnBack} size="small">
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
          <Box>
            <Link href="/support">
              Support Page
            </Link>
          </Box>
        </StyledListItem>
      </List>
    </StyledCard>
  );
}