"use client";
import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useFcmToken } from "@/hooks/useFCMToken";
import { useSendAllUsersNotification } from '@/hooks/use-send-notification';
import { getMessaging, onMessage } from "firebase/messaging";
import { toast } from "sonner";

const AdminPage = () => {
  const storeToken = useMutation(api.notifications.storeToken);
  const tokens = useQuery(api.notifications.getAllTokens);
 
  const { fcmToken, notificationPermissionStatus, retrieveToken } = useFcmToken(storeToken);

  async function sendNotification() {
    await sendAllUsersNotification()
  }

  useEffect(() => {
      const messaging = getMessaging();
      const unsubscribe = onMessage(messaging, (payload) => {
        toast.success(payload.notification.body)
            
      });
  }, []);

  return (
    <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
      </div>
    </div>
  );
}

export default AdminPage;


