'use client';

import { useCallback, useState } from 'react';
import { useFlutterBridge } from '@/hooks/useFlutterBridge';

export const useExitWebView = () => {
  const { exitWebView } = useFlutterBridge();
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = useCallback(() => {
    if (isExiting) return false;

    setIsExiting(true);
    exitWebView();

    setTimeout(() => {
      setIsExiting(false);
    }, 500);

    return true;
  }, [exitWebView, isExiting]);

  return { isExiting, handleExit };
};
