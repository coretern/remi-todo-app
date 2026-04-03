import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as RNuseColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

type ThemeType = 'light' | 'dark';
type TimeFormat = '12h' | '24h';

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: typeof Colors.light;
  timeFormat: TimeFormat;
  toggleTimeFormat: (format: TimeFormat) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  RNuseColorScheme();
  const [theme, setTheme] = useState<ThemeType>('light');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('12h');

  useEffect(() => {
    const loadPreferences = async () => {
      const storedTheme = await AsyncStorage.getItem('@user_theme');
      const storedTimeFormat = await AsyncStorage.getItem('@time_format');
      if (storedTheme) {
        setTheme(storedTheme as ThemeType);
      }
      if (storedTimeFormat) {
        setTimeFormat(storedTimeFormat as TimeFormat);
      }
    };
    loadPreferences();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('@user_theme', newTheme);
  };

  const toggleTimeFormat = async (format: TimeFormat) => {
    setTimeFormat(format);
    await AsyncStorage.setItem('@time_format', format);
  };

  const colors = Colors[theme];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors, timeFormat, toggleTimeFormat }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
