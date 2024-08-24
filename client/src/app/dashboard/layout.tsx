import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "@/styles/globals.css";
<<<<<<< HEAD
import Sidebar from "@/components/DashBoard/Slidebar/SlideBar2";
import Navbar from "@/components/DashBoard/Slidebar/TopBar";
=======
>>>>>>> 585fca686722d2057fdf5f055e70668266b510a6

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeetAi",
  description: "AI powered meeting",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Header containing the Navbar */}
        <header>
          <Navbar />
        </header>

        {/* Main content area with Sidebar and the main content section */}
        <div className="flex h-screen ">
          {/* Ensure the Sidebar takes full height */}
          <aside className="h-full">
            <Sidebar />
          </aside>

          {/* Main content section */}
          <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-20 lg:pt-6 md:pt-15  max-md:pb-14 sm:px-14">
            <div className="w-full">{children}</div>
          </section>
        </div>
      </body>
    </html>
  );
}
