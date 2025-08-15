"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export function BlurGradientBackground() {
  const { theme } = useTheme();
  const backgroundRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (backgroundRef.current) {
      backgroundRef.current.destroy();
      backgroundRef.current = null;
    }

    if (theme === 'dark') {
      import('@/lib/BlurGradientBg.module.js').then(({ BlurGradientBg }) => {
        backgroundRef.current = new BlurGradientBg({
          dom: "background-gradient",
          colors: ["#000000", "#454545", "#000000", "#292929"],
          loop: true
        });
      });
    } else if (theme === 'light') {
      import('@/lib/AbstractShapeBg.module.js').then(({ AbstractShapeBg }) => {
        backgroundRef.current = new AbstractShapeBg({
          dom: "background-gradient",
          colors: ["#f5f5f5", "#c4c0c0", "#e8e8e8", "#ebebeb", "#f0f0f0", "#ffffff"],
          loop: true
        });
      });
    }

    return () => {
      if (backgroundRef.current) {
        backgroundRef.current.destroy();
        backgroundRef.current = null;
      }
    };
  }, [theme, isMounted]);

  return <div id="background-gradient" className="fixed top-0 left-0 w-full h-full -z-10" />;
}