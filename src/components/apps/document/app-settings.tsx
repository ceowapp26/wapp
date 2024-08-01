import React from 'react';
import { useTheme } from '@mui/material/styles';
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
  Menu as MenuIcon
} from '@mui/icons-material';
import OrganizationManagement from '@/components/organizations/organization-management';
import OrganizationSettings from '@/components/organizations/organization-settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UnreleaseFeature from '@/components/unrelease-feature';
import { useSettings } from '@/hooks/use-settings';
import { Spinner } from "@/components/spinner";
import dynamic from 'next/dynamic';

const EmailSchedule = dynamic(() => import('@/components/apps/document/email-schedule'), {
  ssr: false,
});

const drawerWidth = 240;

const AppSettings = () => {
  const settings = useSettings();
  const selectedItem = settings.isSelected;
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSelect = (item) => {
    settings.onSelect(item);
  };

  return (
   <Box className="flex w-full h-full">
      <CssBaseline />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{ mr: 2, ...(open && { display: 'none' }) }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        open={open}
      >
        <div className="flex items-center justify-end p-4">
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={() => handleSelect('Organization')} selected={selectedItem === 'Organization'}>
            <ListItemIcon>
              <CorporateFare />
            </ListItemIcon>
            <ListItemText primary="Organization" />
          </ListItem>
          <ListItem button onClick={() => handleSelect('Management')} selected={selectedItem === 'Management'}>
            <ListItemIcon>
              <SupervisedUserCircle />
            </ListItemIcon>
            <ListItemText primary="Management" />
          </ListItem>
          <ListItem button onClick={() => handleSelect('Email')} selected={selectedItem === 'Email'}>
            <ListItemIcon>
              <Mail />
            </ListItemIcon>
            <ListItemText primary="Email" />
          </ListItem>
          <ListItem button onClick={() => handleSelect('Analytics')} selected={selectedItem === 'Analytics'}>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText primary="Analytic" />
          </ListItem>
          <ListItem button onClick={() => handleSelect('Collections')} selected={selectedItem === 'Collections'}>
            <ListItemIcon>
              <Event />
            </ListItemIcon>
            <ListItemText primary="Collections" />
          </ListItem>
          <ListItem button onClick={() => handleSelect('Tasks')} selected={selectedItem === 'Tasks'}>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary="Tasks" />
          </ListItem>
        </List>
      </Drawer>
      <Box className="flex-grow p-4">
        {selectedItem === 'Organization' &&
          <OrganizationSettings />
        }
        {selectedItem === 'Management' &&
          <OrganizationManagement />
        }
        {selectedItem === 'Email' &&
          <EmailSchedule />
        }
        {selectedItem === 'Analytics' &&
          <UnreleaseFeature featureName="AI-Powered Analytics" featureDescription="Advanced AI Features"/>
        }
        {selectedItem === 'Collections' &&
          <UnreleaseFeature featureName="AI-Powered Collections" featureDescription="Advanced AI Features" />
        }
        {selectedItem === 'Tasks' &&
          <UnreleaseFeature featureName="AI-Powered Tasks" featureDescription="Advanced AI Features" />
        }
      </Box>
    </Box>
  );
};

export default AppSettings;


