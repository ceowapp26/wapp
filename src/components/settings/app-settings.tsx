import React, { useState, useEffect } from 'react';
import { useTheme as useMuiTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from 'next-themes';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  CssBaseline,
  useMediaQuery,
  Typography,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Home,
  Description,
  Event,
  Assignment,
  CorporateFare,
  Mail,
  Settings,
  SupervisedUserCircle,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import OrganizationManagement from '@/components/organizations/organization-management';
import ResourceManagement from '@/components/resources/resource-management';
import OrganizationSettings from '@/components/organizations/organization-settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UnreleaseFeature from '@/components/unrelease-feature';
import { useSettings } from '@/hooks/use-settings';
import { Spinner } from "@/components/spinner";
import ColorfulLoadingCircle from "@/components/colorful-loading-circle";
import dynamic from 'next/dynamic';

const EmailSchedule = dynamic(() => import('@/components/settings/email-schedule'), {
  ssr: false,
  loading: () => <ColorfulLoadingCircle width={16} height={16} background={'blue'} />,
});

const drawerWidth = 240;

const AppSettings = () => {
  const settings = useSettings();
  const selectedItem = settings.isSelected;
  const { theme: nextTheme, setTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const [open, setOpen] = useState(true);
  const [localTheme, setLocalTheme] = useState(nextTheme);

  useEffect(() => {
    setLocalTheme(nextTheme);
  }, [nextTheme]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleSelect = (item) => settings.onSelect(item);
  const toggleTheme = () => {
    const newTheme = localTheme === 'dark' ? 'light' : 'dark';
    setLocalTheme(newTheme);
  };

  const customMuiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: localTheme === 'dark' ? 'dark' : 'light',
        },
      }),
    [localTheme]
  );

  const drawerStyles = {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: localTheme === 'dark' ? customMuiTheme.palette.grey[900] : customMuiTheme.palette.background.paper,
      color: localTheme === 'dark' ? customMuiTheme.palette.common.white : customMuiTheme.palette.text.primary,
      transition: customMuiTheme.transitions.create(['background-color', 'color'], {
        duration: customMuiTheme.transitions.duration.short,
      }),
    },
  };

  const listItemStyles = {
    borderRadius: '8px',
    margin: '4px 8px',
    '&.Mui-selected': {
      backgroundColor: localTheme === 'dark' ? customMuiTheme.palette.primary.dark : customMuiTheme.palette.primary.light,
      color: localTheme === 'dark' ? customMuiTheme.palette.common.white : customMuiTheme.palette.primary.main,
    },
    '&:hover': {
      backgroundColor: localTheme === 'dark' ? customMuiTheme.palette.action.hover : customMuiTheme.palette.action.hover,
    },
    transition: customMuiTheme.transitions.create(['background-color', 'color'], {
      duration: customMuiTheme.transitions.duration.short,
    }),
  };

  const menuItems = [
    { text: 'Organization', icon: <CorporateFare />, key: 'Organization' },
    { text: 'Management', icon: <SupervisedUserCircle />, key: 'Management' },
    { text: 'Resource', icon: <SupervisedUserCircle />, key: 'Resource' },
    { text: 'Email', icon: <Mail />, key: 'Email' },
    { text: 'Analytics', icon: <Description />, key: 'Analytics' },
    { text: 'Collections', icon: <Event />, key: 'Collections' },
    { text: 'Tasks', icon: <Assignment />, key: 'Tasks' },
  ];

  return (
    <ThemeProvider theme={customMuiTheme}>
      <Box className={`flex w-full h-full ${localTheme}`}>
        <CssBaseline />
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ 
            mr: 2, 
            ...(open && { display: 'none' }),
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: customMuiTheme.zIndex.drawer + 1,
            backgroundColor: customMuiTheme.palette.background.paper,
            boxShadow: customMuiTheme.shadows[3],
            '&:hover': {
              backgroundColor: customMuiTheme.palette.action.hover,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          sx={drawerStyles}
          variant="persistent"
          open={open}
        >
          <div className={`flex items-center justify-end p-4 ${localTheme === 'dark' ? 'dark:bg-gray-800' : 'bg-white'}`}>
            <IconButton onClick={handleDrawerClose}>
              {muiTheme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <Tooltip
                key={item.key}
                title={item.text}
                placement="right"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <ListItem 
                  button 
                  onClick={() => handleSelect(item.key)} 
                  selected={selectedItem === item.key}
                  sx={listItemStyles}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Tooltip>
            ))}
          </List>
          <Divider />
          <Box className="p-4">
            <Tooltip title={localTheme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              <IconButton onClick={toggleTheme} color="inherit">
                {localTheme === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Box>
        </Drawer>
        <Box className="flex-grow p-4">
          {selectedItem === 'Organization' && <OrganizationSettings />}
          {selectedItem === 'Management' && <OrganizationManagement />}
          {selectedItem === 'Resource' && <ResourceManagement />}
          {selectedItem === 'Email' && <EmailSchedule />}
          {selectedItem === 'Analytics' && <UnreleaseFeature featureName="AI-Powered Analytics" featureDescription="Advanced AI Features"/>}
          {selectedItem === 'Collections' && <UnreleaseFeature featureName="AI-Powered Collections" featureDescription="Advanced AI Features" />}
          {selectedItem === 'Tasks' && <UnreleaseFeature featureName="AI-Powered Tasks" featureDescription="Advanced AI Features" />}
      </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppSettings;