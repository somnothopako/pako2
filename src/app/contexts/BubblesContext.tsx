import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CustomBubbleMessage {
  messages: string[];
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

interface BubblesContextType {
  isFloatingBubbleEnabled: boolean;
  setFloatingBubbleEnabled: (enabled: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  customMessage: CustomBubbleMessage | null;
  triggerCustomPopup: (message: CustomBubbleMessage) => void;
  clearCustomPopup: () => void;
}

const BubblesContext = createContext<BubblesContextType | undefined>(undefined);

export function BubblesProvider({ children }: { children: ReactNode }) {
  const [isFloatingBubbleEnabled, setIsFloatingBubbleEnabled] = useState<boolean>(() => {
    // Load from localStorage, default to true
    const stored = localStorage.getItem('pako-floating-bubble-enabled');
    return stored === null ? true : stored === 'true';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState<CustomBubbleMessage | null>(null);

  // Persist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pako-floating-bubble-enabled', String(isFloatingBubbleEnabled));
  }, [isFloatingBubbleEnabled]);

  const setFloatingBubbleEnabled = (enabled: boolean) => {
    setIsFloatingBubbleEnabled(enabled);
  };

  const triggerCustomPopup = (message: CustomBubbleMessage) => {
    setCustomMessage(message);
  };

  const clearCustomPopup = () => {
    setCustomMessage(null);
  };

  return (
    <BubblesContext.Provider value={{ 
      isFloatingBubbleEnabled, 
      setFloatingBubbleEnabled,
      isModalOpen,
      setIsModalOpen,
      customMessage,
      triggerCustomPopup,
      clearCustomPopup
    }}>
      {children}
    </BubblesContext.Provider>
  );
}

export function useBubbles() {
  const context = useContext(BubblesContext);
  if (context === undefined) {
    throw new Error('useBubbles must be used within a BubblesProvider');
  }
  return context;
}