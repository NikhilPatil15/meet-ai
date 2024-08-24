'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { sidebarLinks } from '@/constants/index';
import { cn } from '@/lib/utils';
import hamburger from '@/assets/icons/hamburger.svg';
import logo from '@/assets/icons/logo.svg';

const MobileSidebar = () => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px] sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src={hamburger}
            width={36}
            height={36}
            alt="Hamburger Icon"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-dark-1">
          <Link href="/" className="flex items-center gap-2 p-4">
            <Image
              src={logo}
              width={32}
              height={32}
              alt="MeetAi Logo"
            />
            <p className="text-[26px] font-extrabold text-white">MeetAi</p>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto pt-4">
            <section className="flex h-full flex-col gap-6 text-white">
              {sidebarLinks.map(({ route, imgURL, label }) => {
                const isActive = pathname === route || pathname.startsWith(`${route}/`);

                return (
                  <SheetClose asChild key={route}>
                    <Link
                      href={route}
                      className={cn(
                        'flex gap-4 items-center p-4 rounded-lg w-full transition-colors duration-200',
                        {
                          'bg-blue-1': isActive,
                          'hover:bg-blue-1': !isActive,
                        }
                      )}
                    >
                      <Image
                        src={imgURL}
                        alt={label}
                        width={20}
                        height={20}
                      />
                      <p className="font-semibold">{label}</p>
                    </Link>
                  </SheetClose>
                );
              })}
            </section>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileSidebar;
