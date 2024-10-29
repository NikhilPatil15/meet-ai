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
      className={`relative flex flex-col items-center justify-center rounded-xl p-6 md:p-8 xl:p-6 transition-all duration-300 overflow-hidden 
      
      `}
      style={{
        width: "100%",
        maxWidth: "568px",
        minHeight: "18rem",
        margin: "0 auto",
      }}
    >
      {/* Icon */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <Image src={icon} alt="Meeting icon" width={28} height={28} />
      </div>

      {/* Title and Date */}
      <article className="flex flex-col items-center text-center mt-8 md:mt-10">
        <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
        <p className="text-base font-normal mt-1 md:mt-2">{date}</p>
      </article>

      {/* Avatar List */}
      <div className="flex items-center justify-center mt-4 md:mt-6">
        <div className="flex -space-x-3">
          {avatarImages.slice(0, avatarCount).map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`Attendee ${index + 1}`}
              width={40}
              height={40}
              className="rounded-full border-2 border-white md:w-12 md:h-12"
            />
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="mt-6 md:mt-8 rounded-lg px-6 py-3 text-lg font-semibold transition-all duration-300 bg-blue-500 text-white hover:bg-white hover:text-blue-500 shadow-md"
      >
        {isHovered ? "Start meet" : buttonText}
      </button>
    </section>
  );
};

export default MeetingCard;
