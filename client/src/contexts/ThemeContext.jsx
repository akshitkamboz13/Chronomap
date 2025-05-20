import { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from '../utils/themeConfig';

// Create theme context
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('RDR2'); // Default to RDR2 theme
  
  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && Object.keys(THEMES).includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);
  
  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply theme to document root for global CSS variables
    const root = document.documentElement;
    const themeConfig = THEMES[theme];
    
    if (themeConfig) {
      root.style.setProperty('--primary-color', themeConfig.primaryColor);
      root.style.setProperty('--secondary-color', themeConfig.secondaryColor);
      root.style.setProperty('--dark-color', themeConfig.darkColor);
      root.style.setProperty('--font-family', themeConfig.fontFamily);
      
      // Add theme class to body
      document.body.className = `theme-${theme.toLowerCase()}`;
    }
  }, [theme]);
  
  // Change theme function
  const changeTheme = (newTheme) => {
    if (Object.keys(THEMES).includes(newTheme)) {
      setTheme(newTheme);
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useThemeContext() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
} 