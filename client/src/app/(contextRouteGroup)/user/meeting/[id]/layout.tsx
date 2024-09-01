import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

interface layoutProps {
  children: React.ReactNode;

}

export default function RootLayout({ children }: layoutProps) {
  return (
   
      <html lang="en">
        <body className={inter.className}>
          <main>{children}</main>
        </body>
      </html>
 
  );
}
