// settingsContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    darkTheme: false,
    sound: true,
    vibrations: true,
  });

  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem('settings');
        if (saved) {
          setSettings(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save to AsyncStorage when settings change
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem('settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    };
    save();
  }, [settings]);

  // Toggle handlers
  const toggleSound = () => {
    setSettings(prev => ({ ...prev, sound: !prev.sound }));
  };

  const toggleVibrations = () => {
    setSettings(prev => ({ ...prev, vibrations: !prev.vibrations }));
  };

  const toggleTheme = () => {
    setSettings(prev => {
  const newDark = !prev.darkTheme;
  return {
    ...prev,
    darkTheme: newDark,
    theme: newDark ? 'dark' : 'light'
  };
});
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      setSettings,
      toggleSound,
      toggleVibrations,
      toggleTheme
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the context
export const useSettings = () => useContext(SettingsContext);
