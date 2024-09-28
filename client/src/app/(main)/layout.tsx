import type { Metadata } from "next";
<<<<<<< HEAD
import { Inter } from 'next/font/google';
import "../../styles/globals.css";
import { UserContextProvider } from "@/Context/userContext";
 // Adjust the import path as necessary
=======

import { Inter } from "next/font/google";
import "../../styles/globals.css";
import ClientProvider from "../ClientProvider";
import { Providers } from "../providers";
>>>>>>> 457d906baadda6bbcf07459bb8c1bc4135799269

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeetAi",
  description: "AI powered meeting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactElement;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/jpg" href="/assets/logo_meet.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MeetAi</title>
      </head>
<<<<<<< HEAD
      <body className={inter.className}>
        <UserContextProvider>
        
            {children}
          
        </UserContextProvider>
=======

      <body className={inter.className}>
        <Providers>
          <ClientProvider>{children}</ClientProvider>
        </Providers>
>>>>>>> 457d906baadda6bbcf07459bb8c1bc4135799269
      </body>
    </html>
  );
}
