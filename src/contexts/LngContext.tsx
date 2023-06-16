'use client';

// LngContext.tsx
import React, { createContext, useState, PropsWithChildren } from "react";

export interface LngContextType {
  lng: string;
  setLng: (_lang: string) => void;
}

export const LngContext = createContext<LngContextType | undefined>(undefined);

export const LngProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [lng, setLng] = useState<string>('en');

  return (
    <LngContext.Provider value={{
      lng, setLng
    }}>
      {children}
    </LngContext.Provider>
  );
};
