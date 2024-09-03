'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Body } from "../_components/body";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useFcmToken } from "@/hooks/useFCMToken";
import { useSendAllUsersNotification } from '@/hooks/use-send-notification';
import { getMessaging, onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { createSubscription, onApproveSubscription, onErrorSubscriptionPayment } from "@/actions/payments/paypal";
import PaypalButtonComponent from "@/components/paypal/button";

const HomePage = () => {
  const router = useRouter();
  const storeToken = useMutation(api.notifications.storeToken);
  const tokens = useQuery(api.notifications.getAllTokens);
  const { sendAllUsersNotification } = useSendAllUsersNotification();
  const { fcmToken, notificationPermissionStatus, retrieveToken } = useFcmToken(storeToken);

  useEffect(() => {
    const messaging = getMessaging();
    const unsubscribe = onMessage(messaging, (payload) => {
      toast.success(payload.notification.body);
    });
    return () => unsubscribe();
  }, []);

  const goToMySpaceDocuments = () => {
    router.push("/myspace/apps/document");
  };

  return (
    <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Body />
        <button onClick={goToMySpaceDocuments}>Go to MySpace Documents</button>
      </div>
    </div>
  );
}

export default HomePage;


