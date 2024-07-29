import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeetAi",
  description: "AI powered meeting",
};

export default function RootLayout({
  children ,
}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
            <body className={inter.className}>
            <h1>layout for auth</h1>
            {children}
            </body>
    </html>
  );
}
