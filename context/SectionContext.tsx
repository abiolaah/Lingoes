// context/SectionContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context
type SectionContextType = {
  sectionId: number | null;
  setSectionId: (id: number) => void;
};

// Create the context with default values
const SectionContext = createContext<SectionContextType | undefined>(undefined);

// Context provider component
export const SectionProvider = ({ children }: { children: ReactNode }) => {
  const [sectionId, setSectionId] = useState<number | null>(null);

  return (
    <SectionContext.Provider value={{ sectionId, setSectionId }}>
      {children}
    </SectionContext.Provider>
  );
};

// Hook to use the section context
export const useSection = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error("useSection must be used within a SectionProvider");
  }
  return context;
};
