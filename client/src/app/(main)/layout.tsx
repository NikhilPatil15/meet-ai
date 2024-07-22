import GoogleProviders from "@/utils/AuthProviders/GoogleProviders";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeetAi",
  description: "AI powered meeting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleProviders>
      <body className={inter.className}>{children}</body>
      </GoogleProviders>
    </html>
  );
}
