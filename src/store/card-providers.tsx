'use client';

import React, { createContext, useEffect, useState, type PropsWithChildren } from 'react';

const defaultCardData = {
  name: '',
  username: '',
  image: '',
  template: 'one' as 'one' | 'two' | 'three',
};

type CardContextType = {
  state: typeof defaultCardData;
  setState: React.Dispatch<React.SetStateAction<typeof defaultCardData>>;
};

export const CardContext = createContext<CardContextType>({
  state: defaultCardData,
  setState: () => {},
});
// Provide Context
export const CardProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<typeof defaultCardData>(() => {
    // Try to restore from sessionStorage on initialization
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('cardState');
      if (saved) {
        try {
          return JSON.parse(saved) as typeof defaultCardData;
        } catch {
          return { name: '', username: '', image: '', template: 'one' };
        }
      }
    }
    return { name: '', username: '', image: '', template: 'one' };
  });
  // Auto-save to sessionStorage whenever state changes
  useEffect(() => {
    if (state.name || state.username || state.image || state.template) {
      sessionStorage.setItem('cardState', JSON.stringify(state));
    }
  }, [state]);

  return <CardContext.Provider value={{ state, setState }}>{children}</CardContext.Provider>;
};

export default CardContext;
