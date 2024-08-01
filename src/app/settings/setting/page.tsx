'use client';
import { useState } from 'react';
import { Avatar, Card, Input, CardHeader, CardBody, CardFooter, Switch, Textarea, Slider, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { Grid, Typography, Box } from '@mui/material';
import { Settings, Bell, User, Palette, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { HexColorPicker } from "react-colorful";

const ColorPicker = ({ value, onChange }) => (
  <HexColorPicker color={value} onChange={(color) => onChange(color)} />
);

const SettingsPage = () => {
  const [notification, setNotification] = useState(true);
  const [securityLevel, setSecurityLevel] = useState('Medium');
  const [themeColor, setThemeColor] = useState('#ff4757');

  return (
    <Box className="bg-gradient-to-r from-purple-100 to-pink-100 min-h-screen py-12">
      <div className="container mx-auto p-6 max-w-6xl">
        <Typography variant="h3" className="text-4xl font-bold mb-8 pb-4 text-center text-gray-800">
          <Settings className="inline mr-2 mb-1" size={36} />
          Settings
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Typography variant="h6" className="flex items-center text-xl">
                  <Bell className="mr-2" />
                  Notification Settings
                </Typography>
              </CardHeader>
              <CardBody>
                {['Email', 'Push', 'SMS'].map((type) => (
                  <div key={type} className="flex items-center justify-between mb-4 p-2 hover:bg-gray-100 rounded-lg">
                    <Typography variant="body1">{type} Notifications</Typography>
                    <Switch checked={notification} onChange={() => setNotification(!notification)} />
                  </div>
                ))}
              </CardBody>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <Typography variant="h6" className="flex items-center text-xl">
                  <Palette className="mr-2" />
                  Appearance Settings
                </Typography>
              </CardHeader>
              <CardBody>
                <div className="mb-4 p-2">
                  <Typography variant="body1" className="mb-2">Theme Color</Typography>
                  <div className="flex justify-center">
                    <ColorPicker value={themeColor} onChange={setThemeColor} />
                  </div>
                </div>
                <Button color="primary" size="lg" className="w-full mt-4">
                  Save Appearance
                </Button>
              </CardBody>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Typography variant="h6" className="flex items-center text-xl">
                  <SlidersHorizontal className="mr-2" />
                  Preferences
                </Typography>
              </CardHeader>
              <CardBody>
                <div className="mb-4">
                  <Typography variant="body1" className="mb-2">Volume</Typography>
                  <Slider defaultValue={50} min={0} max={100} className="w-full" />
                </div>
                <Button color="primary" size="lg" className="w-full mt-4">
                  Save Preferences
                </Button>
              </CardBody>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                <Typography variant="h6" className="flex items-center text-xl">
                  <ShieldCheck className="mr-2" />
                  Security Settings
                </Typography>
              </CardHeader>
              <CardBody>
                <div className="mb-4">
                  <Typography variant="body1" className="mb-2">Security Level</Typography>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button size="lg" className="w-full">{securityLevel}</Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Security Level" onAction={(key) => setSecurityLevel(key)}>
                      {['Low', 'Medium', 'High'].map((level) => (
                        <DropdownItem key={level}>{level}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <Button color="primary" size="lg" className="w-full mt-4">
                  Save Security Settings
                </Button>
              </CardBody>
            </Card>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
};

export default SettingsPage;