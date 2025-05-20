import { useState } from 'react';

const themes = [
  { id: 'GTA5', name: 'GTA V', shortName: 'GTA' },
  { id: 'RDR2', name: 'Red Dead Redemption 2', shortName: 'RDR2' },
  { id: 'RDR', name: 'Red Dead Redemption', shortName: 'RDR' },
  { id: 'Cyberpunk2077', name: 'Cyberpunk 2077', shortName: 'CP77' },
];

export default function ThemeSwitcher({ currentTheme, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeId) => {
    onChange(themeId);
    setIsOpen(false);
  };

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (currentTheme) {
      case 'GTA5':
        return {
          button: 'bg-gta-dark text-gta-primary border-gta-secondary',
          dropdown: 'bg-gta-dark border-gta-secondary',
          item: 'hover:bg-gta-secondary text-gta-primary',
        };
      case 'RDR2':
        return {
          button: 'bg-rdr2-dark text-rdr2-primary border-rdr2-secondary',
          dropdown: 'bg-rdr2-dark border-rdr2-secondary',
          item: 'hover:bg-rdr2-secondary text-rdr2-primary',
        };
      case 'RDR':
        return {
          button: 'bg-rdr-dark text-rdr-primary border-rdr-secondary',
          dropdown: 'bg-rdr-dark border-rdr-secondary',
          item: 'hover:bg-rdr-secondary text-rdr-primary',
        };
      case 'Cyberpunk2077':
        return {
          button: 'bg-cyberpunk-dark text-cyberpunk-primary border-cyberpunk-secondary',
          dropdown: 'bg-cyberpunk-dark border-cyberpunk-secondary',
          item: 'hover:bg-cyberpunk-secondary text-cyberpunk-primary',
        };
      default:
        return {
          button: 'bg-gray-800 text-white border-gray-600',
          dropdown: 'bg-gray-800 border-gray-600',
          item: 'hover:bg-gray-700 text-white',
        };
    }
  };

  const styles = getThemeStyles();
  const currentThemeObj = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="relative inline-block text-left z-10">
      <button
        type="button"
        className={`inline-flex justify-between items-center w-20 md:w-36 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium border rounded-md shadow-sm focus:outline-none ${styles.button}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="hidden md:inline">{currentThemeObj.name}</span>
        <span className="md:hidden">{currentThemeObj.shortName}</span>
        <svg className="w-4 h-4 md:w-5 md:h-5 ml-1 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className={`origin-top-right absolute right-0 mt-1 md:mt-2 w-32 md:w-48 rounded-md shadow-lg ${styles.dropdown} border focus:outline-none`}>
          <div className="py-1">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`block w-full text-left px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm ${styles.item} ${theme.id === currentTheme ? 'font-bold' : ''}`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <span className="hidden md:inline">{theme.name}</span>
                <span className="md:hidden">{theme.shortName}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 