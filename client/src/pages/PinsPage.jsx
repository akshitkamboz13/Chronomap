import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PinsPage({ theme, user }) {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch pins on component mount
  useEffect(() => {
    if (user) {
      fetchPins();
    }
  }, [user]);

  // Fetch user's pins/notes
  const fetchPins = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/location/pin/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPins(response.data);
    } catch (error) {
      console.error('Error fetching pins:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a pin
  const handleDeletePin = async (pinId) => {
    try {
      await axios.delete(`http://localhost:5000/api/location/pin/${pinId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh pins list
      fetchPins();
    } catch (error) {
      console.error('Error deleting pin:', error);
    }
  };

  // View pin on map
  const handleViewOnMap = (pin) => {
    // Navigate to map page and center on this pin
    navigate('/', { state: { centerLat: pin.lat, centerLng: pin.lng, zoom: 15 } });
  };

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
          heading: 'text-gta-heading',
          container: 'bg-gta-sidebar',
          card: 'bg-gray-800 border-gta-secondary',
          cardText: 'text-gta-primary',
        };
      case 'RDR2':
        return {
          heading: 'text-rdr2-heading',
          container: 'bg-rdr2-sidebar',
          card: 'bg-gray-800 border-rdr2-secondary',
          cardText: 'text-rdr2-primary',
        };
      case 'RDR':
        return {
          heading: 'text-rdr-heading',
          container: 'bg-rdr-sidebar',
          card: 'bg-gray-800 border-rdr-secondary',
          cardText: 'text-rdr-primary',
        };
      case 'Cyberpunk2077':
        return {
          heading: 'text-cyberpunk-heading',
          container: 'bg-cyberpunk-sidebar',
          card: 'bg-gray-800 border-cyberpunk-secondary',
          cardText: 'text-cyberpunk-primary',
        };
      default:
        return {
          heading: 'text-blue-700',
          container: 'bg-gray-100',
          card: 'bg-white border-gray-200',
          cardText: 'text-gray-800',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`p-4 h-full ${styles.container}`}>
      <div className="max-w-4xl mx-auto pb-16">
        <h1 className={`text-2xl font-bold mb-6 ${styles.heading}`}>Saved Locations</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : pins.length === 0 ? (
          <div className={`p-6 rounded-lg shadow text-center ${styles.card} ${styles.cardText}`}>
            <p className="text-lg">No saved locations yet.</p>
            <p className="mt-2 text-sm text-gray-500">Add pins by clicking on the map.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pins.map((pin) => (
              <div key={pin._id} className={`rounded-lg shadow-md border overflow-hidden ${styles.card}`}>
                <div className="p-4">
                  <h3 className={`text-lg font-semibold mb-2 ${styles.cardText}`}>{pin.note || 'Untitled Pin'}</h3>
                  <p className={`text-sm ${styles.cardText} opacity-75 mb-2`}>
                    {formatDate(pin.timestamp)}
                  </p>
                  <div className={`text-xs ${styles.cardText} opacity-70 mb-3`}>
                    <div>Lat: {pin.lat.toFixed(6)}</div>
                    <div>Lng: {pin.lng.toFixed(6)}</div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleViewOnMap(pin)}
                      className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Map
                    </button>
                    <button
                      onClick={() => handleDeletePin(pin._id)}
                      className="text-red-500 hover:text-red-400 text-sm flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 