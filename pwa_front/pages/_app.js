import '../styles/globals.css';
import Link from 'next/link';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return <Component {...pageProps} />
}

export default MyApp;