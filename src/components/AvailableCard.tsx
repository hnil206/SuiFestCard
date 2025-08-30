import React from 'react';

import CardText from './card-text';

interface AvailableCardProps {
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
}

const AvailableCard = ({ className }: AvailableCardProps) => {
  return (
    <div
      className={`flex h-full max-h-[940px] w-full max-w-[600px] flex-col justify-between border border-gray-200 bg-white p-2 text-black shadow-md md:p-4 lg:p-4 ${className}`}
    >
      {/* Top Section */}
      <div className="mb-8 pt-2 lg:mb-0">
        <CardText className="h-fit max-w-full md:w-[240px]" />
      </div>
      {/* Bottom Section */}
      <div>
        <div className="mb-4 text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
          <img src="suifestlogo.png" alt="" className="text-black" />
        </div>
        <div className="flex justify-between text-sm font-medium md:text-2xl lg:text-2xl">
          <span>Oct.2nd</span>
          <span>Singapore</span>
        </div>
      </div>
    </div>
  );
};

export default AvailableCard;
