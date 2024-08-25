'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarLinks } from '@/constants/index';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  // Get the current pathname to determine active link
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[264px] bg-black p-6 pt-28 text-white hidden lg:flex flex-col justify-between z-40">
      {/* Sidebar Navigation */}
      <nav className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map(({ route, imgURL, label }) => {
          const isActive = pathname === route || pathname.startsWith(`${route}/`);

          return (
            <Link
              key={label}
              href={route}
              className={cn(
                'flex items-center gap-4 p-4 rounded-lg transition-colors duration-200',
                isActive ? 'bg-blue-1' : 'hover:bg-blue-1'
              )}
            >
              {/* Sidebar Link Icon */}
              <Image
                src={imgURL}
                alt={label}
                width={24}
                height={24}
                className="min-w-[24px]"
              />
              {/* Sidebar Link Label */}
              <span className="text-lg font-semibold hidden lg:block">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <footer className="mt-auto pt-6 border-t border-gray-700">
        <p className="text-sm text-gray-400">
          © 2024 MeetAi. All rights reserved.
        </p>
        <Link href="/terms" className="text-sm text-blue-500 hover:underline mt-2 block">
          Terms & Conditions
        </Link>
        <Link href="/privacy" className="text-sm text-blue-500 hover:underline mt-1 block">
          Privacy Policy
        </Link>
      </footer>
    </aside>
  );
};

export default Sidebar;
