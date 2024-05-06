import { useState, useEffect } from 'react';

type ScreenSize = {
  width: number;
  height: number;
};

export const Breakpoints = {
  phone: 280,
  'phone-lg': 320,
  'tablet-sm': 480,
  tablet: 640,
  'tablet-lg': 720,
  laptop: 1024,
  desktop: 1280,
};

export const useScreenSize = (): ScreenSize => {
  if (typeof window === 'undefined') return {} as ScreenSize;

  const [screenSize, setScreenSize] = useState({
    width: window.outerWidth,
    height: window.outerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.outerWidth,
        height: window.outerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};
