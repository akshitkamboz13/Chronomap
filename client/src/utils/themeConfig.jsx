export const THEMES = {
  GTA5: {
    name: 'Grand Theft Auto V',
    primaryColor: '#00CCFF',
    secondaryColor: '#FF00CC',
    darkColor: '#111111',
    fontFamily: '"Roboto", sans-serif',
    mapStyle: 'dark',
    mapAccent: '#00CCFF',
    iconSet: 'gta',
    soundSet: 'gta'
  },
  RDR2: {
    name: 'Red Dead Redemption 2',
    primaryColor: '#D2A86E',
    secondaryColor: '#8B4513',
    darkColor: '#2B2118',
    fontFamily: '"Georgia", serif',
    mapStyle: 'vintage',
    mapAccent: '#704214',
    iconSet: 'rdr2',
    soundSet: 'rdr2'
  },
  CYBERPUNK: {
    name: 'Cyberpunk 2077',
    primaryColor: '#FCEE09',
    secondaryColor: '#FF0077',
    darkColor: '#050716',
    fontFamily: '"Rajdhani", sans-serif',
    mapStyle: 'neon',
    mapAccent: '#00FFFF',
    iconSet: 'cyberpunk',
    soundSet: 'cyberpunk'
  }
};

export const getThemeStyles = (theme) => {
  const themeKey = Object.keys(THEMES).find(key => key === theme) || 'RDR2';
  const config = THEMES[themeKey];
  
  // Map theme keys to actual Tailwind classes
  return {
    // Container styles
    appContainer: theme === 'RDR2' ? 'bg-rdr2-dark' : 
                 theme === 'GTA5' ? 'bg-gta-dark' : 
                 theme === 'CYBERPUNK' ? 'bg-cyberpunk-dark' : 'bg-gray-900',
                 
    // Header styles
    header: theme === 'RDR2' ? 'bg-rdr2-dark border-b border-rdr2-pencil' : 
           theme === 'GTA5' ? 'bg-gta-dark border-b border-gta-secondary' : 
           theme === 'CYBERPUNK' ? 'bg-cyberpunk-dark border-b border-cyberpunk-secondary' : 'bg-gray-800 border-b border-gray-700',
           
    // Button styles
    button: theme === 'RDR2' ? 'bg-rdr2-primary text-rdr2-ink hover:bg-rdr2-secondary' : 
           theme === 'GTA5' ? 'bg-gta-primary text-gta-dark hover:bg-gta-secondary' : 
           theme === 'CYBERPUNK' ? 'bg-cyberpunk-primary text-cyberpunk-dark hover:bg-cyberpunk-secondary' : 'bg-blue-600 text-white hover:bg-blue-700',
           
    buttonAlt: theme === 'RDR2' ? 'bg-rdr2-secondary text-rdr2-ink hover:bg-rdr2-primary' : 
              theme === 'GTA5' ? 'bg-gta-secondary text-gta-dark hover:bg-gta-primary' : 
              theme === 'CYBERPUNK' ? 'bg-cyberpunk-secondary text-cyberpunk-dark hover:bg-cyberpunk-primary' : 'bg-gray-600 text-white hover:bg-gray-700',
              
    // Input styles
    input: theme === 'RDR2' ? 'bg-gray-800 text-rdr2-primary border-rdr2-secondary' : 
          theme === 'GTA5' ? 'bg-gray-800 text-gta-primary border-gta-secondary' : 
          theme === 'CYBERPUNK' ? 'bg-gray-800 text-cyberpunk-primary border-cyberpunk-secondary' : 'bg-gray-800 text-white border-gray-600',
          
    // Modal styles
    modal: theme === 'RDR2' ? 'bg-rdr2-dark border-rdr2-secondary' : 
          theme === 'GTA5' ? 'bg-gta-dark border-gta-secondary' : 
          theme === 'CYBERPUNK' ? 'bg-cyberpunk-dark border-cyberpunk-secondary' : 'bg-gray-800 border-gray-600',
          
    modalHeader: theme === 'RDR2' ? 'bg-rdr2-modal-header' : 
                theme === 'GTA5' ? 'bg-gta-modal-header' : 
                theme === 'CYBERPUNK' ? 'bg-cyberpunk-modal-header' : 'bg-gray-700',
                
    // Text styles
    text: theme === 'RDR2' ? 'text-rdr2-primary' : 
         theme === 'GTA5' ? 'text-gta-primary' : 
         theme === 'CYBERPUNK' ? 'text-cyberpunk-primary' : 'text-white',
         
    textAlt: theme === 'RDR2' ? 'text-rdr2-secondary' : 
            theme === 'GTA5' ? 'text-gta-secondary' : 
            theme === 'CYBERPUNK' ? 'text-cyberpunk-secondary' : 'text-gray-400',
  };
};

export const MARKER_CATEGORIES = {
  GTA5: [
    { value: 'default', label: 'Default', emoji: '📍' },
    { value: 'safehouse', label: 'Safehouse', emoji: '🏠' },
    { value: 'mission', label: 'Mission', emoji: '⚔️' },
    { value: 'shop', label: 'Shop', emoji: '🛒' },
    { value: 'danger', label: 'Danger', emoji: '⚠️' },
    { value: 'garage', label: 'Garage', emoji: '🚗' },
    { value: 'clothing', label: 'Clothing', emoji: '👕' },
    { value: 'ammu-nation', label: 'Ammu-Nation', emoji: '🔫' },
    { value: 'barber', label: 'Barber', emoji: '✂️' }
  ],
  RDR2: [
    { value: 'default', label: 'Default', emoji: '📍' },
    { value: 'camp', label: 'Camp', emoji: '⛺' },
    { value: 'town', label: 'Town', emoji: '🏙️' },
    { value: 'quest', label: 'Quest', emoji: '📜' },
    { value: 'hunt', label: 'Hunt', emoji: '🦌' },
    { value: 'fishing', label: 'Fishing', emoji: '🎣' },
    { value: 'gunsmith', label: 'Gun Shop', emoji: '🔫' },
    { value: 'saloon', label: 'Saloon', emoji: '🥃' },
    { value: 'horse', label: 'Stable', emoji: '🐴' }
  ],
  CYBERPUNK: [
    { value: 'default', label: 'Default', emoji: '📍' },
    { value: 'apartment', label: 'Apartment', emoji: '🏢' },
    { value: 'fixer', label: 'Fixer', emoji: '📱' },
    { value: 'ripperdoc', label: 'Ripperdoc', emoji: '💉' },
    { value: 'netrunner', label: 'Netrunner', emoji: '💻' },
    { value: 'weapon', label: 'Weapon Shop', emoji: '🔫' },
    { value: 'bar', label: 'Bar', emoji: '🥂' },
    { value: 'fasttravel', label: 'Fast Travel', emoji: '⚡' },
    { value: 'danger', label: 'Danger Zone', emoji: '☣️' }
  ],
  default: [
    { value: 'default', label: 'Default', emoji: '📍' },
    { value: 'home', label: 'Home', emoji: '🏠' },
    { value: 'work', label: 'Work', emoji: '💼' },
    { value: 'food', label: 'Food', emoji: '🍔' },
    { value: 'shopping', label: 'Shopping', emoji: '🛒' },
    { value: 'entertainment', label: 'Entertainment', emoji: '🎭' },
    { value: 'landmark', label: 'Landmark', emoji: '🗿' },
    { value: 'favorite', label: 'Favorite', emoji: '⭐' },
    { value: 'other', label: 'Other', emoji: '📌' }
  ]
}; 