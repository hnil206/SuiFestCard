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
  bg1: '/teamplate/template1.png',
  bg2: '/teamplate/template2.png',
  bg3: '/teamplate/template3.png',
};

export const CardPreview = ({
  // name,
  username,
  avatarUrl,
  className,
  template = 'bg1',
  textSize,
  imageSize,
  textClassName,
  imageClassName,
}: CardProps) => {
  const bg = TEMPLATE_BG[template];

  // Check if user is logged in and has avatar
  const displayAvatar = avatarUrl;

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden text-white ${className || ''}`}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="px-3 pt-3 lg:mr-9 lg:px-8 lg:pt-8">
        <p className={`font-medium leading-tight lg:text-${textSize} ${textClassName || ''}`}>Speaker</p>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div>
          <div
            className={`relative flex h-[${imageSize}] w-[${imageSize}] items-center justify-center overflow-hidden bg-neutral-300 text-black lg:h-[350px] lg:w-[350px] ${imageClassName || ''}`}
          >
            {displayAvatar ? (
              <img src={avatarUrl} alt="Profile" className="h-full w-full" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzbYTyntexjeYwbQP1GHJ2KwQAg_zZHmuecQ&s"
                  alt="Sui Logo"
                  className="h-full w-full p-2"
                />
              </div>
            )}
          </div>
          <div
            className={`bg-gradient-to-r from-[#8c6037] via-[#853d51] to-[#09120f] text-[10px] md:text-base lg:px-2 lg:py-1 lg:text-lg`}
          >
            @{username}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Card = CardPreview;
