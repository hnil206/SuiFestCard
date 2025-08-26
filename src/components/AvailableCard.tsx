import React from 'react';

const AvailableCard = () => {
  return (
    <div className="flex h-full max-h-[940px] w-full max-w-[600px] flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 text-black shadow-md md:p-8">
      {/* Top Section */}
      <div>
        <h1 className="mb-4 text-3xl font-bold leading-tight lg:text-5xl">
          I'm going
          <br />
          to SuiFest
        </h1>
        <p className="mb-8 text-lg font-normal md:text-2xl">sui.io/suifest</p>
      </div>
      {/* Bottom Section */}
      <div>
        <div className="mb-4 text-4xl font-black tracking-tight md:text-6xl">SuiFest</div>
        <div className="flex justify-between text-lg font-medium md:text-2xl">
          <span>Oct. 2nd</span>
          <span>Singapore</span>
        </div>
      </div>
    </div>
  );
};

export default AvailableCard;
