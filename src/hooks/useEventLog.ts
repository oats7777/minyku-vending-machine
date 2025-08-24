import { useState } from 'react';

export const useEventLog = (maxEntries: number = 12) => {
  const [history, setHistory] = useState<string[]>([]);

  const pushLog = (message: string) => {
    setHistory((prev) => [message, ...prev].slice(0, maxEntries));
  };

  const clearLog = () => {
    setHistory([]);
  };

  return {
    history,
    pushLog,
    clearLog,
  };
};
