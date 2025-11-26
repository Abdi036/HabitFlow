import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    background: readonly [string, string, ...string[]];
    text: string;
    textSecondary: string;
    card: string;
    icon: string;
    tabBar: string;
    tabBarActive: string;
    tabBarInactive: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark (vibrant)

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const colors = {
    background: (isDark 
      ? ["#3AB5F6", "#5B7EF8", "#8364FF"] 
      : ["#f9fafbc4", "#f3f4f6cc", "#e5e7ebc2"]) as readonly [string, string, ...string[]],
    text: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-white/80" : "text-gray-500",
    card: isDark ? "bg-white/20 backdrop-blur-xl" : "bg-white shadow-sm border border-gray-100",
    icon: isDark ? "white" : "#4B5563", 
    tabBar: isDark ? "white" : "white",
    tabBarActive: isDark ? "#3AB5F6" : "#3AB5F6",
    tabBarInactive: isDark ? "#9CA3AF" : "#9CA3AF",
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
