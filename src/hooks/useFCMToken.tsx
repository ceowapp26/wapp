'use client'
import { useEffect, useState } from 'react';
import firebaseApp, { messaging, getToken, vapidKey } from '@/lib/firebase';

export const useFcmToken = (storeToken) => {
  const [fcmToken, setFcmToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

  const retrieveToken = async () => {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const messagingResolve = await messaging;
        if (messagingResolve) {

          // Request notification permission
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === 'granted') {
            const currentToken = await getToken(messagingResolve, {
              vapidKey: vapidKey,
            });
            if (currentToken) {
              setFcmToken(currentToken);
              storeToken({ token: currentToken });
            } else {
              console.log('No registration token available. Request permission to generate one.');
            }
          }
        }
      }
    } catch (error) {
      console.log('Error retrieving token:', error);
    }
  };

  return { fcmToken, notificationPermissionStatus, retrieveToken };
};

