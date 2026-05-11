"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Folder = {
  id: string;
  name: string;
  words: { term: string; definition: string }[];
  questions: any[];
};

export type AppState = {
  isPremium: boolean;
  setIsPremium: (val: boolean) => void;
  userProfile: {
    name: string;
    country: string;
    flag: string;
    targetScore: string;
    points: number;
  };
  updateUserProfile: (profile: Partial<AppState['userProfile']>) => void;
  folders: Folder[];
  addFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, newName: string) => void;
  addWordToFolder: (folderId: string, word: { term: string; definition: string }) => boolean; // Returns true if success
};

const defaultState: AppState = {
  isPremium: false,
  setIsPremium: () => {},
  userProfile: {
    name: "Guest Student",
    country: "Unknown",
    flag: "🌍",
    targetScore: "IELTS 7.0",
    points: 0,
  },
  updateUserProfile: () => {},
  folders: [],
  addFolder: () => {},
  deleteFolder: () => {},
  renameFolder: () => {},
  addWordToFolder: () => false,
};

const AppContext = createContext<AppState>(defaultState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [userProfile, setUserProfile] = useState(defaultState.userProfile);
  const [folders, setFolders] = useState<Folder[]>([
    { id: 'default-1', name: 'My Difficult Words', words: [], questions: [] }
  ]);
  const [isClient, setIsClient] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setIsClient(true);
    const savedProfile = localStorage.getItem('practiceForgeProfile');
    const savedPremium = localStorage.getItem('practiceForgePremium');
    const savedFolders = localStorage.getItem('practiceForgeFolders');
    
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    if (savedPremium) setIsPremium(savedPremium === 'true');
    if (savedFolders) setFolders(JSON.parse(savedFolders));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('practiceForgeProfile', JSON.stringify(userProfile));
      localStorage.setItem('practiceForgePremium', String(isPremium));
      localStorage.setItem('practiceForgeFolders', JSON.stringify(folders));
    }
  }, [userProfile, isPremium, folders, isClient]);

  const updateUserProfile = (profile: Partial<AppState['userProfile']>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  const addFolder = (name: string) => {
    setFolders(prev => [...prev, { id: Date.now().toString(), name, words: [], questions: [] }]);
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
  };

  const renameFolder = (id: string, newName: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
  };

  const addWordToFolder = (folderId: string, word: { term: string; definition: string }) => {
    let success = false;
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        // Enforce limits
        const totalWords = prev.reduce((acc, folder) => acc + folder.words.length, 0);
        if (totalWords >= 1000) return f; // Limit reached
        if (f.words.some(w => w.term === word.term)) return f; // Avoid duplicates
        
        success = true;
        return { ...f, words: [...f.words, word] };
      }
      return f;
    }));
    return success;
  };

  return (
    <AppContext.Provider value={{
      isPremium, setIsPremium,
      userProfile, updateUserProfile,
      folders, addFolder, deleteFolder, renameFolder, addWordToFolder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
