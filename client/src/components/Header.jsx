import { useState } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header({ theme, onLogout, onThemeChange }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'GTA5':
        return {
          header: 'bg-gta-header',
          title: 'text-gta-title',
          border: 'border-gta-secondary',
          userBtn: 'bg-gta-primary text-gta-dark',
          userMenu: 'bg-gta-dark border-gta-secondary',
          userMenuText: 'text-gta-secondary',
        };
      case 'RDR2':
        return {
          header: 'bg-rdr2-header',
          title: 'text-rdr2-title',
          border: 'border-rdr2-pencil',
          userBtn: 'bg-rdr2-primary text-rdr2-ink',
          userMenu: 'bg-rdr2-dark border-rdr2-pencil',
          userMenuText: 'text-rdr2-secondary',
        };
      case 'RDR':
        return {
          header: 'bg-rdr-header',
          title: 'text-rdr-title',
          border: 'border-rdr-secondary',
          userBtn: 'bg-rdr-primary text-rdr-dark',
          userMenu: 'bg-rdr-dark border-rdr-secondary',
          userMenuText: 'text-rdr-secondary',
        };
      case 'Cyberpunk2077':
        return {
          header: 'bg-cyberpunk-header',
          title: 'text-cyberpunk-title',
          border: 'border-cyberpunk-secondary',
          userBtn: 'bg-cyberpunk-primary text-cyberpunk-dark',
          userMenu: 'bg-cyberpunk-dark border-cyberpunk-secondary',
          userMenuText: 'text-cyberpunk-secondary',
        };
      default:
        return {
          header: 'bg-blue-700',
          title: 'text-white',
          border: 'border-gray-600',
          userBtn: 'bg-blue-500 text-white',
          userMenu: 'bg-gray-800 border-gray-600',
          userMenuText: 'text-gray-200',
        };
    }
  };

  const styles = getThemeStyles();

  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        return { username: 'User' };
      }
    }
    return { username: 'User' };
  };

  const user = getUserData();

  return (
    <header className={`px-4 py-2 md:py-3 flex items-center justify-between ${styles.header} border-b ${styles.border}`} style={{ zIndex: 30 }}>
      <div className="flex items-center">
        <h1 className={`text-xl md:text-2xl font-bold ${styles.title}`}>ChronoMap</h1>
        <span className={`hidden md:inline-block text-sm ml-2 ${styles.title} opacity-60`}>• {theme}</span>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="hidden md:block">
          <ThemeSwitcher currentTheme={theme} onChange={onThemeChange} />
        </div>
        
        {/* User Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center space-x-1 rounded-full px-2 py-1 ${styles.userBtn}`}
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm font-bold">{user.username ? user.username[0].toUpperCase() : 'U'}</span>
            </div>
            <span className="hidden md:inline-block text-sm font-medium">{user.username}</span>
          </button>
          
          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg py-1 ${styles.userMenu} border ${styles.border} z-50`}>
              <div className="px-4 py-2 border-b ${styles.border}">
                <p className={`text-sm font-medium ${styles.userMenuText}`}>{user.username}</p>
                <p className={`text-xs opacity-70 ${styles.userMenuText}`}>{user.email}</p>
              </div>
              
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${styles.userMenuText} hover:bg-black/20`}
                onClick={() => {
                  setShowUserMenu(false);
                }}
              >
                Profile Settings
              </button>
              
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${styles.userMenuText} hover:bg-black/20`}
                onClick={() => {
                  setShowUserMenu(false);
                }}
              >
                Account Preferences
              </button>
              
              <div className="border-t ${styles.border} mt-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-black/20"
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 