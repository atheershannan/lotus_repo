import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatContextProvider');
  }
  return context;
};

export const ChatContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(() => {
    // Load persisted state from localStorage
    const saved = localStorage.getItem('chatWidgetOpen');
    return saved ? JSON.parse(saved) : false;
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('chatWidgetOpen', JSON.stringify(isOpen));
  }, [isOpen]);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen(prev => !prev);

  const value = {
    isOpen,
    openChat,
    closeChat,
    toggleChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
