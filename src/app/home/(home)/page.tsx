'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Body from '../_components/body';
import Footer from '@/components/footer';
import { useInAppNotification } from "@/hooks/use-inapp-notification";
import NotificationWrapper from "@/components/notifications/notification-wrapper";

const HomePage = () => {
  const router = useRouter();
  const { isModalOpen, closeModal, notification } = useInAppNotification();
  return (
      <React.Fragment>
        <Body />
        <Footer />
        {notification && 
          <NotificationWrapper
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            type={notification.type}
            notification={notification}
          />
        }
      </React.Fragment>
  );
};

export default HomePage;



