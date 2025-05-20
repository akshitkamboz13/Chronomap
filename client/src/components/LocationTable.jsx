export default function LocationTable({ locations, theme, loading, onLocationClick }) {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'GTA5':
        return {
          table: 'bg-gta-dark text-gta-primary border-gta-secondary',
          header: 'bg-gray-900 text-gta-primary border-gta-secondary',
          row: 'border-gta-secondary hover:bg-gray-900',
        };
      case 'RDR2':
        return {
          table: 'bg-rdr2-dark text-rdr2-primary border-rdr2-secondary',
          header: 'bg-gray-900 text-rdr2-primary border-rdr2-secondary',
          row: 'border-rdr2-secondary hover:bg-gray-900',
        };
      case 'RDR':
        return {
          table: 'bg-rdr-dark text-rdr-primary border-rdr-secondary',
          header: 'bg-gray-900 text-rdr-primary border-rdr-secondary',
          row: 'border-rdr-secondary hover:bg-gray-900',
        };
      case 'Cyberpunk2077':
        return {
          table: 'bg-cyberpunk-dark text-cyberpunk-primary border-cyberpunk-secondary',
          header: 'bg-gray-900 text-cyberpunk-primary border-cyberpunk-secondary',
          row: 'border-cyberpunk-secondary hover:bg-gray-900',
        };
      default:
        return {
          table: 'bg-gray-800 text-white border-gray-600',
          header: 'bg-gray-900 text-white border-gray-600',
          row: 'border-gray-700 hover:bg-gray-700',
        };
    }
  };

  const styles = getThemeStyles();

  if (loading) {
    return (
      <div className={`p-4 rounded-lg border ${styles.table} text-center text-sm md:text-base`}>
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className={`p-4 rounded-lg border ${styles.table} text-center text-sm md:text-base`}>
        No location data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full border rounded-lg overflow-hidden ${styles.table} text-xs md:text-base`}>
        <thead className={styles.header}>
          <tr>
            <th className="px-2 md:px-4 py-1 md:py-2 border-b text-left">Date & Time</th>
            <th className="px-2 md:px-4 py-1 md:py-2 border-b text-left hidden md:table-cell">Latitude</th>
            <th className="px-2 md:px-4 py-1 md:py-2 border-b text-left hidden md:table-cell">Longitude</th>
            <th className="px-2 md:px-4 py-1 md:py-2 border-b text-center md:hidden">Location</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location, index) => (
            <tr 
              key={index} 
              className={`${styles.row} cursor-pointer`}
              onClick={() => onLocationClick && onLocationClick(location)}
            >
              <td className="px-2 md:px-4 py-1 md:py-2 border-b">{formatDate(location.timestamp)}</td>
              <td className="px-2 md:px-4 py-1 md:py-2 border-b hidden md:table-cell">{location.lat.toFixed(6)}</td>
              <td className="px-2 md:px-4 py-1 md:py-2 border-b hidden md:table-cell">{location.lng.toFixed(6)}</td>
              <td className="px-2 md:px-4 py-1 md:py-2 border-b text-center md:hidden">
                <button className="p-1 bg-blue-600 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 