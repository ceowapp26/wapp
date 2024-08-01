import { useState } from 'react';

type Token = {
  id: string;
  token: string;
};

type NotificationData = {
  id: string;
  type: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  senderAvatar: string;
};

type SendToAllUsersFunc = (notification: { id: string; notification: NotificationData }) => Promise<void>;

export const useSendAllUsersNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resData, setResData] = useState<string | null>(null);

  const sendAllUsersNotification = async (tokens: Token[], data: NotificationData, sendToAllUsers: SendToAllUsersFunc) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send_notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({ tokens, data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send notification');
      }

      const result = await response.json();

      if (result) {
        setResData(result);
        for (const token of tokens) {
          await sendToAllUsers({ id: token.id, notification: data });
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendAllUsersNotification, resData, loading, error };
};
