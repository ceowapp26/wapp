// File: firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
importScripts('swenv.js');

// Set Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

let messaging;
try {
  messaging = firebase.messaging.isSupported() ? firebase.messaging() : null;
} catch (err) {
  console.error('Failed to initialize Firebase Messaging', err);
}

// Handle background messages
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      tag: notificationTitle,
      icon: payload.notification?.image || 'default-icon.png',
      data: {
        url: payload?.data?.openUrl,
      },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification when clicked
  const urlToOpen = event.notification.data.url || 'https://www.test.com/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

const registerServiceWorker = async (serviceWorkerUrl) => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(serviceWorkerUrl);
      console.info(`Service worker registered successfully with scope: ${registration.scope}`, registration);
      return registration;
    } catch (error) {
      console.error(`Service worker registration failed: ${error.message}`, error);
      throw new Error('Service worker registration failed.');
    }
  } else {
    console.warn('Service workers are not supported in this browser.');
    return null;
  }
};

const initFirebaseMessaging = async () => {
  try {
    const registration = await registerServiceWorker('/firebase-messaging-sw.js');
    if (registration) {
      // Add further initialization code for Firebase Messaging here if needed
      console.info('Firebase Messaging service worker initialized successfully.');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Messaging service worker:', error);
  }
};

// Call the initialization function
initFirebaseMessaging();
