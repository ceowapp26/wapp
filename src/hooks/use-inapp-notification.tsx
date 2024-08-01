"use client"
import React, { useState, useEffect } from 'react';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useFcmToken } from '@/hooks/useFCMToken';
import { getMessaging, onMessage } from 'firebase/messaging';
import { useSendAllUsersNotification } from '@/hooks/use-send-notification';
import { useUser } from "@clerk/nextjs";

export const useInAppNotification = () => {
  const storeToken = useMutation(api.notifications.storeToken);
  const deleteUnusedRecords = useMutation(api.notifications.deleteUnusedRecords);
  const { fcmToken, retrieveToken } = useFcmToken(storeToken);
  const { resData } = useSendAllUsersNotification();
  const [notification, setNotification] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await deleteUnusedRecords();
        await retrieveToken();
      } catch (error) {
        console.error('Error deleting unused records or retrieving token:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const messaging = getMessaging();
    const unsubscribe = onMessage(messaging, (payload) => {
      setNotification({
        title: payload.notification.title,
        content: payload.notification.body,
        type: payload.data.type
      });
      setIsModalOpen(true);
    });
    return () => unsubscribe();
  }, [resData]);

  const closeModal = () => {
    setIsModalOpen(false);
    setNotification(null); 
  };

  return { resData, isModalOpen, closeModal, notification };
};
