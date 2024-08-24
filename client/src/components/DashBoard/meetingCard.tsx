"use client";

import Image from "next/image";
import { avatarImages } from "@/constants/AvatarData";
import { useState } from "react";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: string;
  avatarCount: number;
  buttonIcon1?: string;
  buttonText?: string;
  handleClick: () => void;
}

const MeetingCard = ({
  icon,
  title,
  date,
  avatarCount,
  buttonIcon1,
  handleClick,
  buttonText = "Join meet",
}: MeetingCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className={`relative flex min-h-[300px] w-full flex-col justify-between rounded-[17px] px-4 py-6 xl:max-w-[568px] transition-colors ${
        isHovered ? "bg-blue-2" : "bg-dark-1"
      }`}
    >
      <Image
        src={icon}
        alt="icon"
        width={28}
        height={28}
        className="absolute top-4 left-4"
      />
      <article className="flex flex-col items-center justify-center gap-2 mt-4">
        <h1 className="text-2xl font-bold text-center">{title}</h1>
        <p className="text-base font-normal text-center">{date}</p>
      </article>
      <article className="flex flex-col items-center justify-center mt-4 relative">
        <div className="relative flex justify-center w-full">
          <div className="flex space-x-4">
            {avatarImages.slice(0, avatarCount).map((img, index) => (
              <Image
                key={index}
                src={img}
                alt="attendee"
                width={110}
                height={110}
                className="rounded-full"
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            className={`rounded-lg px-20 py-2 xl:px-25 sm:px-25 transition-colors 
            }`}
            style={{ backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(11, 66, 195, 1)', color: isHovered ? 'rgba(11, 66, 195, 1)' : 'rgba(255, 255, 255, 1)',
              height: '3rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              borderRadius: '0.75rem',
              fontSize: '1.125rem',
              lineHeight: '1',
              transitionDuration: '0.3s'}}
          >
            {isHovered ? "Start meet" : buttonText}
          </button>
        </div>
      </article>
    </section>
  );
};

export default MeetingCard;