import { useColorScheme } from "nativewind";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Colors } from "../Constant/Colors";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof Colors.light | typeof Colors.dark;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [theme, setTheme] = useState<Theme>(
    colorScheme === "light" ? "light" : "dark"
  );

  useEffect(() => {
    if (colorScheme) {
      setTheme(colorScheme === "light" ? "light" : "dark");
    }
  }, [colorScheme]);

  const isDark = theme === "dark";

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    toggleColorScheme();
  }, [toggleColorScheme]);

  const colors = useMemo(() => {
    return isDark ? Colors.dark : Colors.light;
  }, [isDark]);

  const value = useMemo(
    () => ({
      theme,
      isDark,
      toggleTheme,
      colors,
    }),
    [theme, isDark, toggleTheme, colors]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
