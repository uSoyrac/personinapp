"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type Folder = {
  id: string;
  name: string;
  words: { term: string; definition: string }[];
  questions: unknown[];
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
  // Tracks whether the initial localStorage load has completed, so we never
  // persist the default state over real saved data before reading it.
  const hasLoadedRef = useRef(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('practiceForgeProfile');
    const savedPremium = localStorage.getItem('practiceForgePremium');
    const savedFolders = localStorage.getItem('practiceForgeFolders');

    // These setState calls hydrate context from persisted localStorage on mount.
    // They must run client-side (not during render) to avoid SSR hydration mismatches.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    if (savedPremium) setIsPremium(savedPremium === 'true');
    if (savedFolders) setFolders(JSON.parse(savedFolders));
    /* eslint-enable react-hooks/set-state-in-effect */

    hasLoadedRef.current = true;
  }, []);

  // Save to local storage on change (but only after the initial load)
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    localStorage.setItem('practiceForgeProfile', JSON.stringify(userProfile));
    localStorage.setItem('practiceForgePremium', String(isPremium));
    localStorage.setItem('practiceForgeFolders', JSON.stringify(folders));
  }, [userProfile, isPremium, folders]);

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
