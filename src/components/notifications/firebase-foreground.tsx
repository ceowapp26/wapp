'use client'
import { useFcmToken } from "@/hooks/useFCMToken";
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '@/lib/firebase';
import { useEffect } from 'react';

export default function FcmTokenComp() {
  const { fcmToken, notificationPermissionStatus } = useFcmToken();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (notificationPermissionStatus === 'granted') {
        const messaging = getMessaging(firebaseApp);
        const unsubscribe = onMessage(messaging, (payload) => console.log('Foreground push notification received:', payload));
        return () => {
          unsubscribe();
        };
      }
    }
  }, [notificationPermissionStatus]);

  return null;
}
