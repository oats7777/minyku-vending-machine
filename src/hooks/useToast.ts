import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
  };

  const clearToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    clearToast,
  };
};
