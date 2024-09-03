"use client"
import { getToken, messaging, vapidKey } from "@/lib/firebase";

export async function requestPermission(storeToken) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, { vapidKey: vapidKey });
      if (currentToken) {
        storeToken({ token: currentToken });
      } else {
        console.error("No registration token available. Request permission to generate one.");
      }
    } else {
      console.warn("Notification permission denied by the user.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
  }
}

