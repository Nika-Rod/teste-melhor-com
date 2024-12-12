"use client";

import React, { createContext, useContext, useState } from 'react';

interface IdContextProps {
  id: string;
  setId: (id: string) => void;
  resetId: () => void; 
}

const IdContext = createContext<IdContextProps | undefined>(undefined);

export const IdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [id, setId] = useState<string>('');

  const resetId = () => {
    setId(''); 
  };

  return (
    <IdContext.Provider value={{ id, setId, resetId }}>
      {children}
    </IdContext.Provider>
  );
};

export const useIdContext = () => {
  const context = useContext(IdContext);
  if (!context) {
    throw new Error('useIdContext must be used within an IdProvider');
  }
  return context;
};
