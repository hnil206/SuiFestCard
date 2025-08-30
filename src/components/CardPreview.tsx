'use client';

import React from 'react';

interface CardProps {
  name: string;
  username: string;
  avatarUrl?: string | null;
  template?: 'bg1' | 'bg2' | 'bg3';
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  textSize?: string;
  imageSize?: string;
  // Optional overrides appended at the end to take precedence
  textClassName?: string;
  imageClassName?: string;
}

const TEMPLATE_BG: Record<NonNullable<CardProps['template']>, string> = {
  bg1: '/teamplate/card/bg_1.webp',
  bg2: '/teamplate/card/bg_2.webp',
  bg3: '/teamplate/card/bg3.png',
};

export const CardPreview = ({
  // name,
  username,
  avatarUrl,
  className,
  template = 'bg1',
  imageSize,
  imageClassName,
}: CardProps) => {
  const bg = TEMPLATE_BG[template];

  // Check if user is logged in and has avatar
  const displayAvatar = avatarUrl;

  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden text-white ${className || ''}`}>
      <img src={bg} alt="Background" className="absolute inset-0 z-0 h-full w-full object-cover" />
      <div className="relative z-10 flex flex-1 items-center justify-center">
        <div className="border border-white/25">
          <div
            className={`relative flex h-[${imageSize}] w-[${imageSize}] items-center justify-center overflow-hidden bg-black text-black lg:h-[350px] lg:w-[350px] ${imageClassName || ''}`}
          >
            <img
              src={displayAvatar ? avatarUrl : 'https://placehold.co/400x400'}
              alt={displayAvatar ? 'Profile' : 'Sui Logo'}
              className="h-full w-full object-cover"
            />
          </div>
          <div className={`bg-[#030F1C33] text-[10px] backdrop-blur-2xl md:text-base lg:px-2 lg:py-1 lg:text-lg`}>
            @{username}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Card = CardPreview;
