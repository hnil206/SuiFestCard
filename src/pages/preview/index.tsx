'use client';

import { useRef, useState } from 'react';
import { AuthServerUrl } from '@/utils/constant';
import html2canvas from 'html2canvas';

import AvailableCard from '@/components/AvailableCard';
import { CardPreview } from '@/components/CardPreview';

import { useCardStore } from '../../store/cardStore';

const PreviewPage = () => {
  const { state } = useCardStore();
  const captureRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  console.log('PreviewPage state:', state); // Debug log

  //download image
  const handleDownload = async () => {
    const file = await handleCapture();
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'suifest-card.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleCapture = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
      });
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

  const handleShareOnX = async () => {
    setIsSharing(true);
    try {
      const file = await handleCapture();
      if (!file) {
        throw new Error('Failed to capture image');
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload image to server
      const uploadResponse = await fetch(`${AuthServerUrl}/api/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const responseData = (await uploadResponse.json()) as { success: boolean; shareUrl: string; imageId: string };
      const { shareUrl } = responseData;

      // Open Twitter share intent with the server's share URL
      const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterShareUrl, '_blank', 'width=600,height=400');
    } catch (error) {
      console.error('Error sharing on X:', error);
      alert('Failed to share on X. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-199px)] flex-col items-center justify-center">
      <div className="mx-auto w-full min-w-[320px] max-w-[980px] bg-black px-4 text-white lg:px-0">
        <div className="flex w-full justify-center">
          <div className="flex w-full overflow-hidden lg:min-h-[515px]" ref={captureRef}>
            <CardPreview
              name={state.name}
              username={state.username.startsWith('@') ? state.username.slice(1) : state.username}
              avatarUrl={state.image}
              template={state.template}
              textSize="6xl"
              imageSize="120px"
              textClassName="text-2xl lg:text-6xl md:text-5xl"
              imageClassName="h-[120px] w-[120px] md:h-[200px] md:w-[200px] lg:!h-[250px] lg:!w-[250px]"
            />
            <AvailableCard />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 pt-8 text-center text-xl font-bold text-white md:px-8 md:pt-8 lg:px-0 lg:pt-16 lg:text-4xl">
        <h2>Share your newly generated SuiFest Card</h2>
      </div>
      <div className="flex w-full flex-col gap-8 px-5 py-6 lg:flex lg:flex-row lg:items-center lg:justify-center lg:px-0 lg:py-12">
        <button
          className="flex h-12 w-full flex-1 transform items-center justify-center gap-3 rounded-full bg-white px-5 py-4 text-lg font-semibold text-black shadow-lg transition-all duration-75 ease-linear hover:scale-105 hover:bg-gray-100 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 md:w-auto md:flex-none"
          onClick={handleShareOnX}
          disabled={isSharing}
        >
          {isSharing ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
              Sharing...
            </>
          ) : (
            <>
              Share on
              <img src="/xlogo.png" alt="" className="h-5 w-5" />
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          className="flex h-12 w-full flex-1 transform items-center justify-center gap-3 rounded-full bg-white py-4 text-lg font-semibold text-black shadow-lg transition-all duration-75 ease-linear hover:scale-105 hover:bg-gray-100 hover:shadow-xl md:w-auto md:flex-none lg:px-5"
        >
          Download
        </button>
      </div>
    </div>
  );
};
export default PreviewPage;
