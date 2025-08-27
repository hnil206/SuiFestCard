'use client';

import { useRef, useState } from 'react';
import { S3AccessKey, S3EndPoint, S3SecretKey } from '@/utils/constant';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import html2canvas from 'html2canvas';

import AvailableCard from '@/components/AvailableCard';
import { CardPreview } from '@/components/CardPreview';

import { useCardStore } from '../../store/cardStore';

const PreviewPage = () => {
  const { state } = useCardStore();
  const captureRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 👉 Convert base64 → Blob
  const base64ToBlob = (base64: string) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeType = base64.split(',')[0].match(/:(.*?);/)?.[1] || 'image/png';
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  };

  const uploadToS3 = async (file: Blob, fileName: string) => {
    try {
      const client = new S3Client({
        region: 'ap-southeast-1',
        endpoint: S3EndPoint,
        forcePathStyle: true,
        credentials: {
          accessKeyId: S3AccessKey,
          secretAccessKey: S3SecretKey,
        },
      });

      const key = `uploads/${Date.now()}-${fileName}`;

      // ✅ Convert Blob → ArrayBuffer → Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const params = {
        Bucket: 'suifest-card',
        Key: key,
        Body: uint8Array,
        ContentType: 'image/png',
      };

      await client.send(new PutObjectCommand(params));

      return `https://zveeglzhmxqbrrxelxrr.storage.supabase.co/storage/v1/s3/${params.Bucket}/${key}`;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  };

  const handleCapture = async () => {
    if (!captureRef.current) return null;

    try {
      setIsUploading(true);

      // Capture → base64 string
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const base64 = canvas.toDataURL('image/png');

      // Convert base64 → Blob
      const blob = base64ToBlob(base64);

      // Upload to S3
      const url = await uploadToS3(blob, 'suifest-card.png');

      // Create Twitter share link
      const twitterShareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
      window.open(twitterShareLink, '_blank');

      return url;
    } catch (error) {
      console.error('Error capturing or uploading image:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-199px)] flex-col items-center justify-center">
      <div className="mx-auto w-full min-w-[320px] max-w-[685px] bg-black text-white lg:px-0">
        <div className="flex w-full justify-center">
          <div className="flex w-full rounded-r-[32px] lg:min-h-[515px]" ref={captureRef}>
            <CardPreview
              className="w-full rounded-l-[32px]"
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

      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          onClick={handleCapture}
          disabled={isUploading}
          className="flex h-12 w-full flex-1 transform items-center justify-center gap-3 rounded-full bg-white px-5 py-4 text-lg font-semibold text-black shadow-lg hover:scale-105 hover:bg-gray-100 hover:shadow-xl md:w-auto md:flex-none"
        >
          Share on
          <img src="/x-logo.svg" alt="" className="h-5 w-5 text-black" />
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
