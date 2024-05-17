import '../styles/globals.css';
import Link from 'next/link';


function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/">
              <a className="text-white">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/signup">
              <a className="text-white">Sign Up</a>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <a className="text-white">Login</a>
            </Link>
          </li>
        </ul>
      </nav>
      <main className="p-4">
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;