import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { ChevronLeft } from 'lucide-react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LanguageIcon from '@mui/icons-material/Language';
import TuneIcon from '@mui/icons-material/Tune';
import TokenIcon from '@mui/icons-material/Token';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import useMediaQuery from '@mui/material/useMediaQuery';
import LanguageSelector from '@/components/language-selector';
import { _defaultModel, AIModelOptions, APIEndpointOptions } from "@/constants/ai";
import { Select } from "@/components/ui/nextui-select";
import { useModelStore } from '@/stores/features/models/store';
import { useModelSettings } from "@/hooks/use-model-settings";
import { useTokenSettings } from "@/hooks/use-token-settings";
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { ModeToggle } from "./mode-toggle";
import AutoAdjustTokenToggle from "./auto-adjust-token";

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  width: '100%',
  height: '100%',
  paddingTop: "64px",
  overflowY: "auto",
  transition: 'background-color 0.3s ease, color 0.3s ease',
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

export const GeneralSetting = () => {
  const SMALL_SCREEN_THRESHOLD = 480;
  const { theme: nextTheme, setTheme } = useTheme();
  const modelSettings = useModelSettings();
  const tokenSettings = useTokenSettings();
  const inputModel = useModelStore((state) => state.inputModel);
  const setInputModel = useModelStore((state) => state.setInputModel);
  const setApiEndpoint = useModelStore((state) => state.setApiEndpoint);
  const { setRightSidebarType, rightSidebarWidth } = useMyspaceContext();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    setIsSmallScreen(rightSidebarWidth < SMALL_SCREEN_THRESHOLD);
  }, [rightSidebarWidth]);

  const handleReturnBack = () => {
    setRightSidebarType("general");
  };

  return (
    <StyledCard 
      elevation={3} 
      sx={{ 
        bgcolor: nextTheme === 'dark' ? 'grey.900' : 'background.paper',
        color: nextTheme === 'dark' ? 'common.white' : 'common.black',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <IconButton onClick={handleReturnBack} size="small" sx={{ color: 'inherit' }}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">Settings</Typography>
          <Box width={24} />
        </Stack>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List disablePadding>
        <StyledListItem sx={{ flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'flex-start' : 'center' }}>
          <ListItemText 
            primary="Theme" 
            secondary="Toggle dark/light mode" 
            sx={{ 
              '& .MuiListItemText-secondary': { 
                color: nextTheme === 'dark' ? 'grey.500' : 'grey.800', 
              } 
            }} 
          />
            <ModeToggle />
        </StyledListItem>
        <StyledListItem sx={{ flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'flex-start' : 'center' }}>
          <ListItemText 
            primary="Language" 
            secondary="Change application language" 
            sx={{ 
              '& .MuiListItemText-secondary': { 
                color: nextTheme === 'dark' ? 'grey.500' : 'grey.700', 
              } 
            }} 
          />
          <Box mt={isSmallScreen ? 1 : 0} width={isSmallScreen ? "100%" : "auto"}>
            <LanguageSelector 
              IconComponent={LanguageIcon}
              fullWidth={isSmallScreen}
            />
          </Box>
        </StyledListItem>
        <Accordion sx={{ bgcolor: 'inherit', color: 'inherit' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'inherit' }} />}>
            <Typography>AI Model Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
           <StyledListItem sx={{ flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'flex-start' : 'center' }}>
              <ListItemText 
                primary="Token Adjustment" 
                secondary="Auto adjust max tokens value based on current usage."
                sx={{ 
                  '& .MuiListItemText-secondary': { 
                    color: nextTheme === 'dark' ? 'grey.500' : 'grey.700', 
                  } 
                }}  
              />
              <Box mt={isSmallScreen ? 1 : 0} width={isSmallScreen ? "100%" : "auto"}>
                <AutoAdjustTokenToggle />
              </Box>
            </StyledListItem>
            <StyledListItem sx={{ flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'flex-start' : 'center' }}>
              <ListItemText 
                primary="Default Model" 
                secondary="Select your preferred AI model"
                sx={{ 
                  '& .MuiListItemText-secondary': { 
                    color: nextTheme === 'dark' ? 'grey.500' : 'grey.700', 
                  } 
                }}  
              />
              <Box mt={isSmallScreen ? 1 : 0} width={isSmallScreen ? "100%" : "auto"}>
                <Select 
                  options={AIModelOptions} 
                  label="Model"
                  selectedOption={inputModel} 
                  defaultSelectedKeys={[_defaultModel]}
                  setSelectedOption={setInputModel} 
                />
              </Box>
            </StyledListItem>
            <StyledListItem sx={{ flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'flex-start' : 'center' }}>
              <ListItemText 
                primary="Model Configuration" 
                secondary="Adjust model-specific settings" 
                sx={{ 
                  '& .MuiListItemText-secondary': { 
                    color: nextTheme === 'dark' ? 'grey.500' : 'grey.700', 
                  } 
                }} 
              />
              <Box mt={isSmallScreen ? 1 : 0}>
                <StyledButton
                  onClick={modelSettings.onOpen}
                  variant="outlined"
                  startIcon={<TuneIcon />}
                  fullWidth={isSmallScreen}
                >
                  Configure
                </StyledButton>
              </Box>
            </StyledListItem>
            <StyledListItem sx={{ flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'flex-start' : 'center' }}>
              <ListItemText 
                primary="Token Settings" 
                secondary="Manage token-related options" 
                sx={{ 
                  '& .MuiListItemText-secondary': { 
                    color: nextTheme === 'dark' ? 'grey.500' : 'grey.700', 
                  } 
                }} 
              />
              <Box mt={isSmallScreen ? 1 : 0}>
                <StyledButton
                  onClick={tokenSettings.onOpen}
                  variant="outlined"
                  startIcon={<TokenIcon />}
                  fullWidth={isSmallScreen}
                >
                  Manage
                </StyledButton>
              </Box>
            </StyledListItem>
          </AccordionDetails>
        </Accordion>
      </List>
    </StyledCard>
  );
}

