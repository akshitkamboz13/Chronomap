export default function TimelineFilter({ currentFilter, onFilterChange, theme }) {
  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'GTA5':
        return {
          button: 'bg-gta-dark text-gta-primary border-gta-secondary',
          activeButton: 'bg-gta-secondary text-gta-dark',
        };
      case 'RDR2':
        return {
          button: 'bg-rdr2-dark text-rdr2-primary border-rdr2-secondary',
          activeButton: 'bg-rdr2-secondary text-rdr2-dark',
        };
      case 'RDR':
        return {
          button: 'bg-rdr-dark text-rdr-primary border-rdr-secondary',
          activeButton: 'bg-rdr-secondary text-rdr-dark',
        };
      case 'Cyberpunk2077':
        return {
          button: 'bg-cyberpunk-dark text-cyberpunk-primary border-cyberpunk-secondary',
          activeButton: 'bg-cyberpunk-secondary text-cyberpunk-dark',
        };
      default:
        return {
          button: 'bg-gray-800 text-white border-gray-600',
          activeButton: 'bg-gray-600 text-white',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className="flex space-x-2 mb-4">
      <button
        className={`px-4 py-2 rounded-md ${currentFilter === 'all' ? styles.activeButton : styles.button}`}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>
      <button
        className={`px-4 py-2 rounded-md ${currentFilter === 'today' ? styles.activeButton : styles.button}`}
        onClick={() => onFilterChange('today')}
      >
        Today
      </button>
      <button
        className={`px-4 py-2 rounded-md ${currentFilter === 'yesterday' ? styles.activeButton : styles.button}`}
        onClick={() => onFilterChange('yesterday')}
      >
        Yesterday
      </button>
      <button
        className={`px-4 py-2 rounded-md ${currentFilter === 'week' ? styles.activeButton : styles.button}`}
        onClick={() => onFilterChange('week')}
      >
        This Week
      </button>
    </div>
  );
} 