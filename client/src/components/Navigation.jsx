import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

export default function Navigation({ theme, onMapAction }) {
  const [expanded, setExpanded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [shareOption, setShareOption] = useState('link'); // 'link' or 'iframe'
  const [locationName, setLocationName] = useState('');

  // Theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'GTA5':
        return {
          sideBg: 'bg-black/80',
          link: 'text-gta-text',
          activeLink: 'text-gta-primary',
          hoverLink: 'hover:text-gta-hover',
          toggleBtn: 'text-gta-text bg-black/30',
          toggleBtnHover: 'hover:bg-black/60 hover:text-gta-primary',
          mobileNav: 'bg-black/80 border-t border-gta-text/20'
        };
      case 'RDR2':
        return {
          sideBg: 'bg-rdr2-sidebar',
          link: 'text-rdr2-text',
          activeLink: 'text-rdr2-primary',
          hoverLink: 'hover:text-rdr2-hover',
          toggleBtn: 'text-rdr2-text bg-rdr2-btn',
          toggleBtnHover: 'hover:bg-rdr2-btn-hover hover:text-rdr2-primary',
          mobileNav: 'bg-rdr2-sidebar border-t border-rdr2-accent/30'
        };
      case 'RDR':
        return {
          sideBg: 'bg-rdr-sidebar',
          link: 'text-rdr-text',
          activeLink: 'text-rdr-primary',
          hoverLink: 'hover:text-rdr-hover',
          toggleBtn: 'text-rdr-text bg-rdr-btn',
          toggleBtnHover: 'hover:bg-rdr-btn-hover hover:text-rdr-primary',
          mobileNav: 'bg-rdr-sidebar border-t border-rdr-accent/30'
        };
      case 'Cyberpunk2077':
        return {
          sideBg: 'bg-cyberpunk-sidebar',
          link: 'text-cyberpunk-text',
          activeLink: 'text-cyberpunk-primary',
          hoverLink: 'hover:text-cyberpunk-hover',
          toggleBtn: 'text-cyberpunk-text bg-cyberpunk-btn',
          toggleBtnHover: 'hover:bg-cyberpunk-btn-hover hover:text-cyberpunk-primary',
          mobileNav: 'bg-cyberpunk-sidebar border-t border-cyberpunk-accent/30'
        };
      default:
        return {
          sideBg: 'bg-gray-800',
          link: 'text-gray-300',
          activeLink: 'text-white',
          hoverLink: 'hover:text-white',
          toggleBtn: 'text-gray-300 bg-gray-700',
          toggleBtnHover: 'hover:bg-gray-600 hover:text-white',
          mobileNav: 'bg-gray-800 border-t border-gray-700'
        };
    }
  };

  const styles = getThemeStyles();

  // Common navigation links
  const navLinks = [
    {
      to: '/',
      label: 'Map',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      to: '/timeline',
      label: 'Timeline',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      to: '/pins',
      label: 'Pins',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  // Get user's current position for sharing
  const handleShareLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setShowShareModal(true);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your current location. Please check your browser permissions.');
      }
    );
  };
  
  // Generate shareable location link
  const generateShareLink = (location) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?lat=${location.lat}&lng=${location.lng}&zoom=15`;
  };
  
  // Generate iframe HTML code for embedding
  const generateIframeHTML = (location) => {
    const shareLink = generateShareLink(location);
    return `<iframe 
  src="${shareLink}" 
  width="600" 
  height="450" 
  style="border:0;" 
  allowfullscreen="" 
  loading="lazy" 
  referrerpolicy="no-referrer-when-downgrade">
</iframe>`;
  };
  
  // Copy share link to clipboard
  const copyShareLink = async () => {
    if (!currentPosition) return;
    
    const textToCopy = shareOption === 'iframe' 
      ? generateIframeHTML(currentPosition)
      : generateShareLink(currentPosition);
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert(`${shareOption === 'iframe' ? 'Embed code' : 'Link'} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback selection method for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`${shareOption === 'iframe' ? 'Embed code' : 'Link'} copied to clipboard!`);
    }
  };
  
  // Save shared location
  const saveSharedLocation = async () => {
    if (!currentPosition) return;
    
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!userData.id) {
      alert('You must be logged in to save locations');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/location/shared', {
        userId: userData.id,
        sharedByUserId: userData.id,
        lat: currentPosition.lat,
        lng: currentPosition.lng,
        name: locationName || 'Shared Location',
        theme: theme
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Reset name and close modal
      setLocationName('');
      setShowShareModal(false);
      alert('Location saved successfully!');
    } catch (error) {
      console.error('Error saving shared location:', error);
      alert('Failed to save location. Please try again.');
    }
  };

  // Map controls
  const mapControls = [
    {
      label: 'Add Location',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#DEC29B" fillOpacity="0.15" stroke="#716454"/>
          <path d="M16 8L16 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 16L24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
        </svg>
      ),
      onClick: () => onMapAction && onMapAction('addLocation')
    },
    {
      label: 'Track Distance',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 25C7 25 13 7 16 7C19 7 25 25 25 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="16" cy="7" r="3" fill="currentColor"/>
          <circle cx="7" cy="25" r="3" fill="currentColor"/>
          <circle cx="25" cy="25" r="3" fill="currentColor"/>
          <path d="M7 20L25 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
        </svg>
      ),
      onClick: () => onMapAction && onMapAction('trackDistance')
    },
    {
      label: 'Get Directions',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 14L8 24L16 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M24 18L24 8L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M13 21L16 24L13 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M19 5L16 8L19 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      onClick: () => onMapAction && onMapAction('getDirections')
    },
    {
      label: 'Find My Location',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M16 4V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 24V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M4 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M24 16H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="16" cy="16" r="3" fill="currentColor"/>
        </svg>
      ),
      onClick: () => onMapAction && onMapAction('findMe')
    },
    {
      label: 'Share Location',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="16" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="24" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 14L21 10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 18L21 22" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      onClick: handleShareLocation
    }
  ];

  return (
    <>
      {/* Mobile Bottom Navigation - Fixed at the bottom */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 ${styles.mobileNav} z-50`}>
        <div className="flex justify-around">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex flex-col items-center py-2 px-2 ${styles.link} ${isActive ? styles.activeLink : styles.hoverLink}`
              }
              end={link.to === '/'}
            >
              {link.icon}
              <span className="text-xs mt-1">{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Side Navigation - With expandable sidebar */}
      <aside 
        className={`h-full ${styles.sideBg} transition-all duration-300 ease-in-out ${expanded ? 'w-52' : 'w-16'}`}
        style={{ zIndex: 20 }}
      >
        <nav className="h-full py-4 flex flex-col items-center">
          {/* Navigation toggle button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className={`mb-6 rounded-full w-8 h-8 flex items-center justify-center ${styles.toggleBtn} ${styles.toggleBtnHover}`}
            title={expanded ? "Collapse menu" : "Expand menu"}
          >
            {expanded ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
          
          {/* Main navigation links */}
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex items-center p-2 mb-4 rounded-lg ${expanded ? 'w-44 justify-start' : 'w-10 justify-center'} ${styles.link} ${isActive ? `${styles.activeLink} bg-black/20` : styles.hoverLink}`
              }
              title={link.label}
              end={link.to === '/'}
            >
              <div className="flex-shrink-0">{link.icon}</div>
              {expanded && <span className="ml-3 whitespace-nowrap">{link.label}</span>}
            </NavLink>
          ))}

          {/* Map controls section */}
          <div className={`mt-auto ${expanded ? 'w-44 px-2' : 'w-10 px-0'}`}>
            <h3 className={`text-xs uppercase mb-2 ${expanded ? 'text-left' : 'text-center'} ${styles.link}`}>
              {expanded ? 'Map Tools' : '•••'}
            </h3>
            {mapControls.map((control, index) => (
              <button
                key={index}
                onClick={control.onClick}
                className={`flex items-center p-2 mb-2 rounded-lg ${expanded ? 'w-full justify-start' : 'w-10 justify-center'} text-left ${styles.link} ${styles.hoverLink}`}
                title={control.label}
              >
                <div className="flex-shrink-0">{control.icon}</div>
                {expanded && <span className="ml-3 whitespace-nowrap">{control.label}</span>}
              </button>
            ))}
          </div>
        </nav>
      </aside>
      
      {/* Share Location Modal */}
      {showShareModal && currentPosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className={`bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden`}>
            <div className={`py-2 px-4 ${
              theme === 'GTA5' ? 'bg-gta-primary' : 
              theme === 'RDR2' ? 'bg-rdr2-primary' : 
              theme === 'RDR' ? 'bg-rdr-primary' : 
              theme === 'Cyberpunk2077' ? 'bg-cyberpunk-primary' : 
              'bg-blue-600'
            }`}>
              <div className="flex justify-between items-center">
                <h3 className={`font-medium text-white`}>Share Location</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-200 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-3">Share this location with others:</p>
              
              {/* Share options tabs */}
              <div className="flex border-b mb-4">
                <button
                  onClick={() => setShareOption('link')}
                  className={`px-4 py-2 ${shareOption === 'link' 
                    ? `border-b-2 border-b-${
                      theme === 'GTA5' ? 'gta-primary' : 
                      theme === 'RDR2' ? 'rdr2-primary' : 
                      theme === 'RDR' ? 'rdr-primary' : 
                      theme === 'Cyberpunk2077' ? 'cyberpunk-primary' : 
                      'blue-500'} -mb-px font-medium` 
                    : 'text-gray-500'}`}
                >
                  Share by Link
                </button>
                <button
                  onClick={() => setShareOption('iframe')}
                  className={`px-4 py-2 ${shareOption === 'iframe' 
                    ? `border-b-2 border-b-${
                      theme === 'GTA5' ? 'gta-primary' : 
                      theme === 'RDR2' ? 'rdr2-primary' : 
                      theme === 'RDR' ? 'rdr-primary' : 
                      theme === 'Cyberpunk2077' ? 'cyberpunk-primary' : 
                      'blue-500'} -mb-px font-medium` 
                    : 'text-gray-500'}`}
                >
                  Embed as iFrame
                </button>
              </div>
              
              {/* Share link input */}
              {shareOption === 'link' && (
                <div className="flex items-center mb-4">
                  <input 
                    type="text"
                    readOnly
                    value={generateShareLink(currentPosition)}
                    className="flex-1 p-2 border rounded-l text-sm bg-gray-50"
                  />
                  <button
                    onClick={copyShareLink}
                    className={`px-3 py-2 rounded-r ${
                      theme === 'GTA5' ? 'bg-gta-primary text-gta-dark hover:bg-gta-secondary' : 
                      theme === 'RDR2' ? 'bg-rdr2-primary text-rdr2-ink hover:bg-rdr2-secondary' : 
                      theme === 'RDR' ? 'bg-rdr-primary text-rdr-dark hover:bg-rdr-secondary' : 
                      theme === 'Cyberpunk2077' ? 'bg-cyberpunk-primary text-cyberpunk-dark hover:bg-cyberpunk-secondary' : 
                      'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Copy
                  </button>
                </div>
              )}
              
              {/* iFrame embed code */}
              {shareOption === 'iframe' && (
                <div className="mb-4">
                  <textarea
                    readOnly
                    value={generateIframeHTML(currentPosition)}
                    className="w-full p-2 border rounded text-sm bg-gray-50 h-32 font-mono"
                  />
                  <button
                    onClick={copyShareLink}
                    className={`mt-2 px-3 py-2 rounded w-full ${
                      theme === 'GTA5' ? 'bg-gta-primary text-gta-dark hover:bg-gta-secondary' : 
                      theme === 'RDR2' ? 'bg-rdr2-primary text-rdr2-ink hover:bg-rdr2-secondary' : 
                      theme === 'RDR' ? 'bg-rdr-primary text-rdr-dark hover:bg-rdr-secondary' : 
                      theme === 'Cyberpunk2077' ? 'bg-cyberpunk-primary text-cyberpunk-dark hover:bg-cyberpunk-secondary' : 
                      'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    Copy Embed Code
                  </button>
                </div>
              )}
              
              <div className="mt-6 border-t pt-4">
                <p className="text-gray-700 mb-3">Save this location:</p>
                <div className="flex items-center mb-2">
                  <input 
                    type="text"
                    placeholder="Location name (optional)"
                    className="flex-1 p-2 border rounded text-sm"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>
                <button
                  onClick={saveSharedLocation}
                  className={`w-full py-2 px-4 rounded mb-4 ${
                    theme === 'GTA5' ? 'bg-gta-primary text-gta-dark hover:bg-gta-secondary' : 
                    theme === 'RDR2' ? 'bg-rdr2-primary text-rdr2-ink hover:bg-rdr2-secondary' : 
                    theme === 'RDR' ? 'bg-rdr-primary text-rdr-dark hover:bg-rdr-secondary' : 
                    theme === 'Cyberpunk2077' ? 'bg-cyberpunk-primary text-cyberpunk-dark hover:bg-cyberpunk-secondary' : 
                    'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Save Location
                </button>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className={`px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 