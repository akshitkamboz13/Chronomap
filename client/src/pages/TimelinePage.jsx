import { useState, useEffect } from 'react';
import axios from 'axios';
import TimelineFilter from '../components/TimelineFilter';
import LocationTable from '../components/LocationTable';

export default function TimelinePage({ theme, user }) {
  const [timeFilter, setTimeFilter] = useState('all');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's location history when user or timeFilter changes
  useEffect(() => {
    if (user) {
      fetchLocations();
    }
  }, [user, timeFilter]);

  // Fetch user's location history
  const fetchLocations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/location/${user.id}${timeFilter !== 'all' ? `?timeFilter=${timeFilter}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete location history
  const handleDeleteHistory = async () => {
    if (!user) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/location/${user.id}${timeFilter !== 'all' ? `?timeFilter=${timeFilter}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh locations
      fetchLocations();
    } catch (error) {
      console.error('Error deleting locations:', error);
    }
  };

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'GTA5':
        return {
          heading: 'text-gta-heading',
          container: 'bg-gta-sidebar',
        };
      case 'RDR2':
        return {
          heading: 'text-rdr2-heading',
          container: 'bg-rdr2-sidebar',
        };
      case 'RDR':
        return {
          heading: 'text-rdr-heading',
          container: 'bg-rdr-sidebar',
        };
      case 'Cyberpunk2077':
        return {
          heading: 'text-cyberpunk-heading',
          container: 'bg-cyberpunk-sidebar',
        };
      default:
        return {
          heading: 'text-blue-heading',
          container: 'bg-blue-sidebar',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`p-4 h-full ${styles.container}`}>
      <div className="max-w-4xl mx-auto pb-16">
        <h1 className={`text-2xl font-bold mb-6 ${styles.heading}`}>Location Timeline</h1>
        
        <div className="mb-6">
          <h2 className={`text-lg font-semibold mb-2 ${styles.heading}`}>Filter</h2>
          <TimelineFilter 
            onFilterChange={(filter) => setTimeFilter(filter)} 
            currentFilter={timeFilter}
            theme={theme}
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold ${styles.heading}`}>Location History</h2>
            <button
              onClick={handleDeleteHistory}
              className="text-sm text-red-600 hover:text-red-700 px-3 py-1 rounded border border-red-600 hover:bg-red-600/10"
              disabled={loading}
            >
              Clear History
            </button>
          </div>
          <LocationTable 
            locations={locations} 
            loading={loading} 
            theme={theme}
            onLocationClick={() => {}} // We could redirect to map page with this location
          />
        </div>
      </div>
    </div>
  );
} 