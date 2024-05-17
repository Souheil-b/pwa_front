import { Inter } from "next/font/google";
import "../styles/globals.css";  // Assurez-vous que le chemin est correct

const inter = Inter({ subsets: ["latin"] });

function Layout({ children }) {
  return (
    <div className={inter.className}>
      {children}
    </div>
  );
}

export default Layout;