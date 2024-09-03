import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

export const UrlFirebaseConfig = new URLSearchParams(firebaseConfig).toString();

const swUrl = `${process.env.SERVER_URL}/firebase-messaging-sw.js?${UrlFirebaseConfig}`;

let firebaseApp;
let messaging;

if (typeof window !== 'undefined') {
  firebaseApp = initializeApp(firebaseConfig);
  messaging = (async () => {
    try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
        return getMessaging(firebaseApp);
      }
      console.log("Firebase is not supported in this browser");
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  })();
}

export const getOrRegisterServiceWorker = () => {
  if (
    typeof window !== 'undefined' &&
    "serviceWorker" in navigator &&
    typeof window.navigator.serviceWorker !== "undefined"
  ) {
    return window.navigator.serviceWorker
      .getRegistration("/firebase-push-notification-scope")
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope: "/firebase-push-notification-scope",
          }
        );
      });
  }
  throw new Error("The browser doesn't support service worker.");
};

export { messaging, getToken, onMessage };
export const vapidKey = process.env.FIREBASE_MESSAGING_KEY;
export default firebaseApp;