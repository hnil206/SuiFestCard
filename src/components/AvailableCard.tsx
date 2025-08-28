import React from 'react';

interface AvailableCardProps {
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
}

const AvailableCard = ({ className }: AvailableCardProps) => {
  return (
    <div
      className={`flex h-full max-h-[940px] w-full max-w-[600px] flex-col justify-between border border-gray-200 bg-white p-2 text-black shadow-md md:p-8 lg:p-4 ${className}`}
    >
      {/* Top Section */}
      <div>
        <h1 className="text-2xl font-medium leading-tight lg:mb-4 lg:text-5xl">
          I'm going
          <br />
          to SuiFest
        </h1>
        <p className="mb-3 text-sm font-normal lg:mb-8 lg:text-2xl">sui.io/suifest</p>
      </div>
      {/* Bottom Section */}
      <div>
        <div className="mb-4 text-4xl font-black tracking-tight lg:text-6xl">
          <img src="suifestlogo.png" alt="" className="text-black" />
        </div>
        <div className="flex justify-between text-sm font-medium lg:text-2xl">
          <span>Oct.2nd</span>
          <span>Singapore</span>
        </div>
      </div>
    </div>
  );
};

export default AvailableCard;
