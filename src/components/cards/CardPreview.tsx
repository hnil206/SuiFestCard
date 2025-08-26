// 'use client';
// import { useSession } from 'next-auth/react';
// import Image from 'next/image';
// import React from 'react';

// interface CardProps {
//   name: string;
//   username: string;
//   avatarUrl?: string | null;
//   template?: 'navy' | 'purple' | 'brown';
//   className?: React.HTMLAttributes<HTMLDivElement>['className'];
//   textSize?: string;
//   imageSize?: string;
//   // Optional overrides appended at the end to take precedence
//   textClassName?: string;
//   imageClassName?: string;
// }

// const TEMPLATE_BG: Record<NonNullable<CardProps['template']>, string> = {
//   navy: '#020b16',
//   purple: '#120718',
//   brown: '#1a130a',
// };

// export const CardPreview = ({
//   name,
//   username,
//   avatarUrl,
//   className,
//   template = 'navy',
//   textSize,
//   imageSize,
//   textClassName,
//   imageClassName,
// }: CardProps) => {
//   const { data: session, status } = useSession();
//   const bg = TEMPLATE_BG[template];

//   // Check if user is logged in and has avatar
//   const isLoggedIn = status === 'authenticated' && session?.user;
//   const displayAvatar = isLoggedIn && avatarUrl;

//   return (
//     <div
//       className={`relative flex flex-col justify-between overflow-hidden text-white ${className || ''}`}
//       style={{ backgroundColor: bg }}
//     >
//       <div className='p-3 lg:p-8'>
//         <p
//           className={`font-medium text-base leading-tight tracking-[-0.02em] md:text-2xl lg:text-${textSize} ${textClassName || ''}`}
//         >
//           I'm going to
//         </p>
//         <p
//           className={`font-medium text-base leading-tight tracking-[-0.02em] md:text-2xl lg:text-${textSize} ${textClassName || ''}`}
//         >
//           Sui Fest
//         </p>
//       </div>
//       <div className='flex items-center justify-center lg:px-8 lg:py-2'>
//         <div>
//           <div
//             className={`relative flex h-[${imageSize}] w-[${imageSize}] items-center justify-center overflow-hidden bg-neutral-300 text-black lg:h-[400px] lg:w-[400px] ${imageClassName || ''}`}
//           >
//             {displayAvatar ? (
//               <Image src={avatarUrl} alt='Profile' fill className='object-cover' priority />
//             ) : (
//               <div className='flex h-full w-full items-center justify-center bg-orange-400'>
//                 <Image src='/logo-sui.png' alt='Sui Logo' fill className='object-contain p-2' priority />
//               </div>
//             )}
//           </div>
//           <div
//             className={`bg-gradient-to-r from-[#8c6037] via-[#853d51] to-[#09120f] text-[8px] lg:px-2 lg:py-3 lg:text-lg `}
//           >
//             @{username}
//           </div>
//         </div>
//       </div>
//       <div
//         className={`flex justify-end px-3 pt-2 font-medium text-base lg:p-6 lg:text-${textSize} ${textClassName || ''}`}
//       >
//         sui.io/suifest
//       </div>
//     </div>
//   );
// };

// export const Card = CardPreview;
