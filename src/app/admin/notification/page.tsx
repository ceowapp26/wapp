'use client';
import React, { useState, ChangeEvent, MouseEvent } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import * as Tabs from '@radix-ui/react-tabs';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { useSendAllUsersNotification } from '@/hooks/use-send-notification';
import { v4 as uuidv4 } from 'uuid';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { Typography, TextField, Button, Box } from '@mui/material';

const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={`
        text-sm leading-none text-gray-700 rounded-md flex items-center h-9 px-3 relative select-none
        data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none
        data-[highlighted]:outline-none data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-900
      `}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute right-2 flex items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

SelectItem.displayName = 'SelectItem';

type NotificationData = {
  id: string;
  type: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  senderAvatar: string;
};

const SendInAppNotificationPage = () => {
  const [currentTab, setCurrentTab] = useState('firebase');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationType, setNotificationType] = useState('popup');
  const [notificationContent, setNotificationContent] = useState('');
  const tokens = useQuery(api.notifications.getAllTokens);
  const sendToAllUsers = useMutation(api.notifications.sendToAllUsers);
  const { sendAllUsersNotification } = useSendAllUsersNotification();

  const handleNotificationSend = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const notificationMessage: NotificationData = {
      id: uuidv4(),
      type: notificationType, 
      title: notificationTitle,
      content: notificationContent,
      date: Date.now().toString(),
      sender: "WApp Admin",
      senderAvatar: "Wapp Avatar",
    };

    if (!notificationMessage.title.trim() || !notificationMessage.content.trim()) {
      toast.error('Notification title and content cannot be empty.');
      return;
    }

    try {
      await sendAllUsersNotification(tokens, notificationMessage, sendToAllUsers);
      toast.success('Notification sent successfully.');
      setNotificationTitle('');
      setNotificationContent('');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification. Please try again later.');
    }
  };

  const renderNotificationForm = () => (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={notificationTitle}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNotificationTitle(e.target.value)}
      />
      <Select.Root value={notificationType} onValueChange={setNotificationType}>
        <Select.Trigger className="inline-flex items-center justify-between rounded-md px-4 py-2 text-sm leading-none bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <Select.Value placeholder="Select a type..." />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
            <Select.Viewport className="p-1">
              <Select.Group>
                <Select.Label className="px-3 py-2 text-xs font-semibold text-gray-500">
                  Notification Type
                </Select.Label>
                <SelectItem value="popup">Popup</SelectItem>
                <SelectItem value="anchor">Anchor</SelectItem>
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <TextField
        label="Content"
        variant="outlined"
        multiline
        rows={4}
        fullWidth
        value={notificationContent}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotificationContent(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleNotificationSend}
        sx={{ mt: 2 }}
      >
        Send Notification
      </Button>
    </Box>
  );

  return (
    <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Tabs.Root
        defaultValue="firebase"
        onValueChange={setCurrentTab}
      >
        <Tabs.List className="flex gap-2 mb-4">
          {['firebase', 'pusher'].map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${currentTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {['firebase', 'pusher'].map((tab) => (
          <Tabs.Content key={tab} value={tab}>
            <Card>
              <CardHeader className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
                <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white', py: 2 }}>
                  {tab.toUpperCase()} PUSH NOTIFICATION
                </Typography>
              </CardHeader>
              <CardBody sx={{ p: 4 }}>
                {renderNotificationForm()}
              </CardBody>
            </Card>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Box>
  );
};

export default SendInAppNotificationPage;