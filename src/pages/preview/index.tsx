'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';

import AvailableCard from '@/components/AvailableCard';
import { CardPreview } from '@/components/CardPreview';

import { useCardStore } from '../../store/cardStore';

const PreviewPage = () => {
  const { state } = useCardStore();
  const captureRef = useRef<HTMLDivElement>(null);
  console.log('PreviewPage state:', state); // Debug log
  const handleCapture = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current);
      console.log('Canvas generated:', canvas);
      const dataUrl = canvas.toDataURL('image/png');
      console.log('Data URL:', dataUrl);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'suifest-card.png', { type: 'image/png' });

      return file;
    }

    return null;
  };

  return (
    <div className="flex min-h-[calc(100vh-199px)] flex-col items-center justify-center">
      <div className="mx-auto w-full min-w-[320px] max-w-[916px] bg-black px-5 text-white lg:px-0">
        <div className="flex w-full justify-center">
          <div className="flex w-full rounded-r-[32px]" ref={captureRef}>
            <CardPreview
              className="w-full"
              name={state.name}
              username={state.username.startsWith('@') ? state.username.slice(1) : state.username}
              avatarUrl={state.image}
              template={state.template}
              textSize="3xl"
              imageSize="60px"
              textClassName="text-[8px] sm:text-[8px] md:text-[8px] lg:text-3xl"
              imageClassName="h-[60px] w-[60px] sm:h-[60px] sm:w-[60px] md:h-[60px] md:w-[60px] lg:!h-[250px] lg:!w-[250px]"
            />
            <AvailableCard />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 pt-5 text-center text-xl font-bold text-white md:px-8 md:pt-8 lg:px-0 lg:pt-16 lg:text-4xl">
        <h2>Share your newly generated SuiFest Card</h2>
      </div>
      <div className="flex w-full items-center justify-center px-5 py-6 lg:px-0 lg:py-12">
        <button
          className="flex h-12 w-full flex-1 transform items-center justify-center gap-3 rounded-full bg-white px-5 py-4 text-lg font-semibold text-black shadow-lg hover:scale-105 hover:bg-gray-100 hover:shadow-xl md:w-auto md:flex-none"
          onClick={handleCapture}
        >
          Share on
          <img src="/x-logo.svg" alt="" className="h-5 w-5 text-black" />
        </button>
      </div>
    </div>
  );
};
export default PreviewPage;
