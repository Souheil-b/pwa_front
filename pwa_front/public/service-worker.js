importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js');

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
});

// Pour injecter les fichiers pré-cachés par Workbox
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
});


self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', function (event) {
  console.log('Push event received:', event);
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Default message body',
    icon: '/icon/icon-192x192.png',
    badge: '/icon/icon-512x512.png',
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Default title', options)
  );
});