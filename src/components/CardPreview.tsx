'use client';

import React from 'react';

interface CardProps {
  name: string;
  username: string;
  avatarUrl?: string | null;
  template?: 'one' | 'two' | 'three';
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  textSize?: string;
  imageSize?: string;
  // Optional overrides appended at the end to take precedence
  textClassName?: string;
  imageClassName?: string;
}

const TEMPLATE_BG: Record<NonNullable<CardProps['template']>, string> = {
  one: '/teamplate/template1.png',
  two: '/teamplate/template2.png',
  three: '/teamplate/template3.png',
};

export const CardPreview = ({
  // name,
  username,
  avatarUrl,
  className,
  template = 'one',
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
      className={`relative flex flex-col justify-between overflow-hidden text-white ${className || ''}`}
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
      }}
    >
      <div className="p-3 lg:p-8">
        <p
          className={`text-base font-medium leading-tight tracking-[-0.02em] md:text-2xl lg:text-${textSize} ${textClassName || ''}`}
        >
          I'm going to
        </p>
        <p
          className={`text-base font-medium leading-tight tracking-[-0.02em] md:text-2xl lg:text-${textSize} ${textClassName || ''}`}
        >
          Sui Fest
        </p>
      </div>
      <div className="flex items-center justify-center lg:px-8 lg:py-2">
        <div>
          <div
            className={`relative flex h-[${imageSize}] w-[${imageSize}] items-center justify-center overflow-hidden bg-neutral-300 text-black lg:h-[400px] lg:w-[400px] ${imageClassName || ''}`}
          >
            {displayAvatar ? (
              <img src={avatarUrl} alt="Profile" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-orange-400">
                <img src="/logo-sui.png" alt="Sui Logo" className="object-contain p-2" />
              </div>
            )}
          </div>
          <div
            className={`bg-gradient-to-r from-[#8c6037] via-[#853d51] to-[#09120f] text-[8px] lg:px-2 lg:py-1 lg:text-lg`}
          >
            @{username}
          </div>
        </div>
      </div>
      <div
        className={`flex justify-end px-3 pt-2 text-base font-medium lg:p-6 lg:text-${textSize} ${textClassName || ''}`}
      >
        sui.io/suifest
      </div>
    </div>
  );
};

export const Card = CardPreview;
