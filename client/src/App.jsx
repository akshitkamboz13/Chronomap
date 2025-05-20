import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MapPage from './pages/MapPage';
import TimelinePage from './pages/TimelinePage';
import PinsPage from './pages/PinsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [theme, setTheme] = useState('GTA5');
  const [user, setUser] = useState(null);
  const mapActionRef = useRef(null);

  // Check for logged in user
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setTheme(parsedUser.preferredTheme || 'GTA5');
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  // Handle user login
  const handleLogin = (userData) => {
    setUser(userData);
    setTheme(userData.preferredTheme || 'GTA5');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };
  
  // Handle map actions from navigation
  const handleMapAction = (action) => {
    if (mapActionRef.current) {
      mapActionRef.current(action);
    }
  };

  // If no user, show login screen
  if (!user) {
    return <Login onLogin={handleLogin} theme={theme} />;
  }

  return (
    <Router>
      <div className="h-screen w-screen flex flex-col overflow-hidden relative">
        {/* Header - Highest z-index */}
        <div className="relative w-full" style={{ zIndex: 30 }}>
          <Header 
            theme={theme} 
            onLogout={handleLogout} 
            onThemeChange={handleThemeChange}
          />
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Navigation - Middle z-index */}
          <div className="hidden md:block h-full" style={{ zIndex: 20 }}>
            <Navigation 
              theme={theme} 
              onMapAction={handleMapAction} 
            />
          </div>
          
          {/* Main Content Area - Lowest z-index */}
          <div className="flex-1 relative overflow-auto" style={{ zIndex: 10 }}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <MapPage 
                    theme={theme} 
                    user={user} 
                    mapActionRef={mapActionRef}
                  />
                } 
              />
              <Route path="/timeline" element={<TimelinePage theme={theme} user={user} />} />
              <Route path="/pins" element={<PinsPage theme={theme} user={user} />} />
              <Route 
                path="/settings" 
                element={
                  <SettingsPage 
                    theme={theme} 
                    user={user} 
                    onThemeChange={handleThemeChange} 
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
        
        {/* Mobile Navigation is handled within the Navigation component */}
      </div>
    </Router>
  );
}

export default App;
