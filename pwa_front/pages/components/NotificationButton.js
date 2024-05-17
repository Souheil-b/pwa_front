"use client";

import { useEffect, useState } from 'react';

export default function NotificationButton() {
  const [permission, setPermission] = useState(null);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      console.log("Notification permission:", Notification.permission);
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js').then((reg) => {
        console.log('Service Worker Registered:', reg);
        setRegistration(reg);
      }).catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    }
  }, []);

  const askPermission = () => {
    Notification.requestPermission().then((perm) => {
      setPermission(perm);
      console.log("Notification permission granted:", perm);
    });
  };

  const sendNotification = (title, body) => {
    if (permission === 'granted') {
      if (registration) {
        const options = {
          body: body,
          icon: '/icon/icon-192x192.png',
        };
        registration.showNotification(title, options).then(() => {
          console.log("Notification sent:", title, body);
        }).catch(err => {
          console.error("Notification error:", err);
        });
      } else {
        console.error("Service worker registration not found.");
      }
    } else {
      console.error("Notification permission not granted.");
    }
  };

  if (permission === null) {
    return null; // Ou un composant de chargement
  }

  return (
    <div>
      {permission === 'granted' ? (
        <>
          <button onClick={() => sendNotification('Hello from Next.js PWA!', 'This is a notification message.')}>
            Send Notification
          </button>
          <button onClick={() => sendNotification('Notification', 'Bouton appuyé')}>
            Notification "Bouton appuyé"
          </button>
        </>
      ) : (
        <button onClick={askPermission}>Enable Notifications</button>
      )}
    </div>
  );
}