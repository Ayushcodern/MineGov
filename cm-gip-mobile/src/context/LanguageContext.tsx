import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../config/i18n';

export interface LanguageContextType {
  language: 'en' | 'hi';
  currentLanguage: 'en' | 'hi';
  changeLanguage: (lang: 'en' | 'hi') => Promise<void>;
  setLanguage: (lang: 'en' | 'hi') => Promise<void>;
  toggleLanguage: () => Promise<void>;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  currentLanguage: 'en',
  changeLanguage: async () => {},
  setLanguage: async () => {},
  toggleLanguage: async () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const saved = await AsyncStorage.getItem('@minegov_language');
        if (saved === 'hi' || saved === 'en') {
          setLanguageState(saved);
          i18n.changeLanguage(saved);
        }
      } catch (err) {
        console.warn('Error loading language:', err);
      }
    };
    loadSavedLanguage();
  }, []);

  const changeLanguage = async (lang: 'en' | 'hi') => {
    try {
      setLanguageState(lang);
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem('@minegov_language', lang);
    } catch (err) {
      console.warn('Error saving language:', err);
    }
  };

  const toggleLanguage = async () => {
    const next = language === 'hi' ? 'en' : 'hi';
    await changeLanguage(next);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      currentLanguage: language, 
      changeLanguage, 
      setLanguage: changeLanguage, 
      toggleLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useAppLanguage = () => useContext(LanguageContext);
