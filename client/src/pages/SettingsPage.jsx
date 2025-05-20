import { useState, useEffect } from 'react';
import axios from 'axios';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function SettingsPage({ theme, onThemeChange, user }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [trackingInterval, setTrackingInterval] = useState(60); // in seconds
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      
      // Get tracking interval from localStorage or use default
      const savedInterval = localStorage.getItem('trackingInterval');
      if (savedInterval) {
        setTrackingInterval(parseInt(savedInterval, 10));
      }
    }
  }, [user]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    setMessage('');
    setIsError(false);
    
    // Save user settings
    try {
      await axios.put(`http://localhost:5000/api/user/${user.id}`, {
        username,
        email,
        preferredTheme: theme
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Save tracking interval to localStorage
      localStorage.setItem('trackingInterval', trackingInterval.toString());
      
      // Update message
      setMessage('Settings saved successfully');
      setIsError(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage(error.response?.data?.message || 'Failed to save settings');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'GTA5':
        return {
          heading: 'text-gta-heading',
          container: 'bg-gta-sidebar',
          input: 'bg-gray-800 text-gta-primary border-gta-secondary focus:ring-gta-primary focus:border-gta-primary',
          button: 'bg-gta-secondary text-gta-dark hover:bg-gta-primary',
          label: 'text-gta-primary',
        };
      case 'RDR2':
        return {
          heading: 'text-rdr2-heading',
          container: 'bg-rdr2-sidebar',
          input: 'bg-gray-800 text-rdr2-primary border-rdr2-secondary focus:ring-rdr2-primary focus:border-rdr2-primary',
          button: 'bg-rdr2-secondary text-rdr2-dark hover:bg-rdr2-primary',
          label: 'text-rdr2-primary',
        };
      case 'RDR':
        return {
          heading: 'text-rdr-heading',
          container: 'bg-rdr-sidebar',
          input: 'bg-gray-800 text-rdr-primary border-rdr-secondary focus:ring-rdr-primary focus:border-rdr-primary',
          button: 'bg-rdr-secondary text-rdr-dark hover:bg-rdr-primary',
          label: 'text-rdr-primary',
        };
      case 'Cyberpunk2077':
        return {
          heading: 'text-cyberpunk-heading',
          container: 'bg-cyberpunk-sidebar',
          input: 'bg-gray-800 text-cyberpunk-primary border-cyberpunk-secondary focus:ring-cyberpunk-primary focus:border-cyberpunk-primary',
          button: 'bg-cyberpunk-secondary text-cyberpunk-dark hover:bg-cyberpunk-primary',
          label: 'text-cyberpunk-primary',
        };
      default:
        return {
          heading: 'text-blue-700',
          container: 'bg-blue-sidebar',
          input: 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-blue-500 focus:border-blue-500',
          button: 'bg-blue-600 text-white hover:bg-blue-500',
          label: 'text-gray-800',
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`p-4 h-full ${styles.container}`}>
      <div className="max-w-2xl mx-auto pb-16">
        <h1 className={`text-2xl font-bold mb-6 ${styles.heading}`}>Settings</h1>
        
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className={`text-lg font-semibold mb-4 ${styles.heading}`}>Profile</h2>
            
            <div className="mb-4">
              <label className={`block mb-2 text-sm font-medium ${styles.label}`}>
                Username
              </label>
              <input
                type="text"
                className={`w-full p-2 rounded-lg border ${styles.input}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className={`block mb-2 text-sm font-medium ${styles.label}`}>
                Email
              </label>
              <input
                type="email"
                className={`w-full p-2 rounded-lg border ${styles.input}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          {/* Theme Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className={`text-lg font-semibold mb-4 ${styles.heading}`}>Appearance</h2>
            
            <div className="mb-4">
              <label className={`block mb-2 text-sm font-medium ${styles.label}`}>
                Map Theme
              </label>
              <ThemeSwitcher currentTheme={theme} onChange={onThemeChange} />
            </div>
          </div>
          
          {/* Location Tracking Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className={`text-lg font-semibold mb-4 ${styles.heading}`}>Location Tracking</h2>
            
            <div className="mb-4">
              <label className={`block mb-2 text-sm font-medium ${styles.label}`}>
                Tracking Interval (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="3600"
                className={`w-full p-2 rounded-lg border ${styles.input}`}
                value={trackingInterval}
                onChange={(e) => setTrackingInterval(parseInt(e.target.value, 10))}
              />
              <p className="text-sm text-gray-500 mt-1">
                How often your location is updated (minimum 10 seconds)
              </p>
            </div>
          </div>
          
          {/* Status Message */}
          {message && (
            <div className={`p-3 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`py-2 px-6 rounded-lg ${styles.button}`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 