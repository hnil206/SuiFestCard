import React, { useContext, useState } from 'react';
import { CardContext } from '@/store/card-providers';
import { useNavigate } from '@tanstack/react-router';

import { CardControlPanel, TemplateKey } from '@/components/CardControlPanel';
import { CardPreview } from '@/components/CardPreview';

const Home = () => {
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateKey>('one');
  const context = useContext(CardContext);
  const { setState } = context;
  const navigate = useNavigate();
  const handleGenerate = () => {
    setState({ image: avatar || '', name: fullName, username: handle, template });
    navigate({ to: '/preview' }); // or whatever route you want to navigate to
    console.log('Generating card with:', { fullName, handle, avatar, template });
  };
  return (
    <div>
      <div className="flex min-h-0 items-center">
        <div className="h-full w-full items-center px-6 py-12 text-white">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,_700px)_484px]">
              {/* Preview */}
              <div className="flex max-w-[700px] items-start justify-center md:justify-start">
                <CardPreview
                  name={fullName}
                  username={handle}
                  template={template}
                  avatarUrl={avatar}
                  textSize="6xl"
                  imageSize="120px"
                  textClassName="text-base md:!text-base lg:!text-6xl"
                  imageClassName="h-[120px] w-[120px] lg:h-[400px] lg:w-[400px]"
                  className="h-full w-full rounded-[32px] border-[16px] border-[#1f1f1f] text-white shadow-[0_0_20px_rgba(255,255,255,0.08)] lg:rounded-[64px]"
                />
              </div>

              {/* Control Panel */}
              <CardControlPanel
                fullName={fullName}
                handle={handle}
                avatar={avatar}
                template={template}
                onFullNameChange={setFullName}
                onHandleChange={setHandle}
                onAvatarChange={setAvatar}
                onTemplateChange={setTemplate}
                onGenerate={handleGenerate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
