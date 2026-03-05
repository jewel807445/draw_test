import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  names: string[];
  setNames: (names: string[]) => void;
  winners: string[];
  setWinners: (winners: string[]) => void;
  groups: string[][];
  setGroups: (groups: string[][]) => void;
  addNames: (newNames: string[]) => void;
  clearAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [names, setNames] = useState<string[]>([]);
  const [winners, setWinners] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[][]>([]);

  const addNames = (newNames: string[]) => {
    // Filter out duplicates and empty strings if needed, or keep them based on user preference?
    // Usually names should be unique or at least non-empty.
    const cleanNames = newNames.map(n => n.trim()).filter(n => n.length > 0);
    setNames(prev => [...new Set([...prev, ...cleanNames])]);
  };

  const clearAll = () => {
    setNames([]);
    setWinners([]);
    setGroups([]);
  };

  return (
    <AppContext.Provider value={{ names, setNames, winners, setWinners, groups, setGroups, addNames, clearAll }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
