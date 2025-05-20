import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Map from '../components/Map';
import PinForm from '../components/PinForm';

export default function MapPage({ theme, user, mapActionRef }) {
  const [pins, setPins] = useState([]);
  const [locations, setLocations] = useState([]);
  const [sharedLocations, setSharedLocations] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [showPinForm, setShowPinForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [trackingMode, setTrackingMode] = useState(null);
  const [trackingPoints, setTrackingPoints] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [locationToShare, setLocationToShare] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [shareOption, setShareOption] = useState('link'); // 'link' or 'iframe'
  const [selectedMapFeature, setSelectedMapFeature] = useState(null);
  
  // Handle map actions from navigation
  const handleMapAction = useCallback((action) => {
    switch(action) {
      case 'addLocation':
        // Set the map to add location mode
        setTrackingMode('add-location');
        setTrackingPoints([]);
        break;
      case 'trackDistance':
        // Set the map to distance tracking mode
        setTrackingMode('track-distance');
        setTrackingPoints([]);
        break;
      case 'getDirections':
        // Set the map to directions mode
        setTrackingMode('directions');
        setTrackingPoints([]);
        break;
      case 'findMe':
        // Set the map to locate user
        if (currentPosition) {
          setSelectedMapFeature({
            type: 'current-location',
            position: currentPosition,
            zoom: 16
          });
        } else {
          locateUser();
        }
        break;
      case 'shareLocation':
        // Open share location modal with current position
        if (currentPosition) {
          setLocationToShare(currentPosition);
          setShowShareModal(true);
        }
        break;
      default:
        break;
    }
  }, [currentPosition]);
  
  // Connect map action ref to handler
  useEffect(() => {
    if (mapActionRef) {
      mapActionRef.current = handleMapAction;
    }
    return () => {
      if (mapActionRef) {
        mapActionRef.current = null;
      }
    };
  }, [mapActionRef, handleMapAction]);
  
  // Get user's current position
  useEffect(() => {
    if (user) {
      locateUser();
      
      // Set up interval to track position (every minute)
      const intervalId = setInterval(() => {
        locateUser();
      }, 60000); // 60 seconds
      
      // Clean up interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [user]);
  
  // Locate user and save position
  const locateUser = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentPosition(newPosition);
        
        // Save location to database
        saveUserLocation(newPosition);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  };
  
  // Save user location to database
  const saveUserLocation = async (position) => {
    if (!user) return;
    
    try {
      await axios.post('http://localhost:5000/api/location', {
        userId: user.id,
        lat: position.lat,
        lng: position.lng,
        theme: theme,
        timestamp: new Date()
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };
  
  // Handle map click to add pin or track points
  const handleMapClick = (location) => {
    // Handle "Share Location" action from the map button
    if (location.type === 'share') {
      setLocationToShare({
        lat: location.lat,
        lng: location.lng
      });
      setShowShareModal(true);
      return;
    }
    
    if (trackingMode === 'add-location') {
      setSelectedLocation(location);
      setShowPinForm(true);
      setTrackingMode(null);
    }
    else if (trackingMode === 'track-distance') {
      setTrackingPoints(prev => [...prev, location]);
    }
    else if (trackingMode === 'directions') {
      if (trackingPoints.length === 0) {
        setTrackingPoints([location]);
      } else if (trackingPoints.length === 1) {
        setTrackingPoints(prev => [...prev, location]);
        // Keep directions mode active to allow changing destinations
      }
    }
    else if (onMapClick) {
      setSelectedLocation(location);
      setShowPinForm(true);
    }
  };

  // Handle pin form submission
  const handlePinSubmit = async (pinData) => {
    if (!user) return;
    
    try {
      await axios.post('http://localhost:5000/api/location/pin', {
        ...pinData,
        userId: user.id
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh pins
      fetchPins();
      
      // Close form
      setShowPinForm(false);
      setSelectedLocation(null);
    } catch (error) {
      console.error('Error creating pin:', error);
    }
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
    if (!locationToShare) return;
    
    const textToCopy = shareOption === 'iframe' 
      ? generateIframeHTML(locationToShare)
      : generateShareLink(locationToShare);
    
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
    if (!locationToShare || !user) return;
    
    try {
      await axios.post('http://localhost:5000/api/location/shared', {
        userId: user.id,
        sharedByUserId: user.id, // Since user is saving their own location
        lat: locationToShare.lat,
        lng: locationToShare.lng,
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
  
  // Fetch recent user locations for the path
  useEffect(() => {
    if (user) {
      fetchRecentLocations();
      fetchPins();
      fetchSharedLocations();
    }
  }, [user]);

  // Check for shared location in URL
  useEffect(() => {
    if (user) {
      const urlParams = new URLSearchParams(window.location.search);
      const lat = urlParams.get('lat');
      const lng = urlParams.get('lng');
      const zoom = urlParams.get('zoom');
      
      if (lat && lng) {
        const sharedLocation = {
          lat: parseFloat(lat),
          lng: parseFloat(lng)
        };
        
        // Set the location on the map
        setSelectedMapFeature({
          type: 'shared-location',
          position: sharedLocation,
          zoom: zoom ? parseInt(zoom) : 15
        });
        
        // Ask user if they want to save this location
        if (confirm('Would you like to save this shared location?')) {
          setLocationToShare(sharedLocation);
          setShowShareModal(true);
        }
        
        // Remove params from URL without reloading
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [user]);

  // Fetch shared locations
  const fetchSharedLocations = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/location/shared/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSharedLocations(response.data);
    } catch (error) {
      console.error('Error fetching shared locations:', error);
    }
  };

  // Fetch recent locations (last 24h only for map)
  const fetchRecentLocations = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/location/${user.id}?timeFilter=day`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Fetch user's pins/notes
  const fetchPins = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/location/pin/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPins(response.data);
    } catch (error) {
      console.error('Error fetching pins:', error);
    }
  };
  
  // Reset tracking mode
  const resetTrackingMode = () => {
    setTrackingMode(null);
    setTrackingPoints([]);
  };
  
  // Get theme-specific styles for modal
  const getModalStyles = () => {
    switch (theme) {
      case 'GTA5':
        return {
          modalHeader: 'bg-gta-modal-header',
          modalTitle: 'text-gta-modal-title',
          modalBorder: 'border-gta-secondary',
          actionBtn: 'bg-gta-primary text-gta-dark hover:bg-gta-secondary',
          cancelBtn: 'bg-gray-600 hover:bg-gray-700 text-white',
        };
      case 'RDR2':
        return {
          modalHeader: 'bg-rdr2-modal-header',
          modalTitle: 'text-rdr2-modal-title',
          modalBorder: 'border-rdr2-pencil',
          actionBtn: 'bg-rdr2-primary text-rdr2-ink hover:bg-rdr2-secondary',
          cancelBtn: 'bg-gray-600 hover:bg-gray-700 text-white',
        };
      case 'RDR':
        return {
          modalHeader: 'bg-rdr-modal-header',
          modalTitle: 'text-rdr-modal-title',
          modalBorder: 'border-rdr-secondary',
          actionBtn: 'bg-rdr-primary text-rdr-dark hover:bg-rdr-secondary',
          cancelBtn: 'bg-gray-600 hover:bg-gray-700 text-white',
        };
      case 'Cyberpunk2077':
        return {
          modalHeader: 'bg-cyberpunk-modal-header',
          modalTitle: 'text-cyberpunk-modal-title',
          modalBorder: 'border-cyberpunk-secondary',
          actionBtn: 'bg-cyberpunk-primary text-cyberpunk-dark hover:bg-cyberpunk-secondary',
          cancelBtn: 'bg-gray-600 hover:bg-gray-700 text-white',
        };
      default:
        return {
          modalHeader: 'bg-blue-600',
          modalTitle: 'text-white',
          modalBorder: 'border-blue-300',
          actionBtn: 'bg-blue-500 hover:bg-blue-600 text-white',
          cancelBtn: 'bg-gray-600 hover:bg-gray-700 text-white',
        };
    }
  };
  
  const styles = getModalStyles();
  
  // Get tracking mode instructions
  const getTrackingInstructions = () => {
    switch(trackingMode) {
      case 'add-location':
        return 'Click on the map to add a new location';
      case 'track-distance':
        return `Click multiple points to measure distance (${trackingPoints.length} points selected)`;
      case 'directions':
        if (trackingPoints.length === 0) return 'Click to set starting point';
        if (trackingPoints.length === 1) return 'Click to set destination';
        return 'Route calculated. Click to change destination';
      default:
        return null;
    }
  };
  
  const trackingInstructions = getTrackingInstructions();
  
  return (
    <div className="absolute inset-0">
      <Map 
        theme={theme}
        userLocations={locations}
        pins={pins}
        sharedLocations={sharedLocations}
        onMapClick={handleMapClick}
        currentPosition={currentPosition}
        trackingMode={trackingMode}
        trackingPoints={trackingPoints}
        selectedFeature={selectedMapFeature}
        onResetTracking={resetTrackingMode}
      />
      
      {/* Tracking Mode Instructions */}
      {trackingInstructions && (
        <div className="absolute top-16 left-0 right-0 mx-auto w-fit bg-black/70 text-white px-4 py-2 rounded-full z-30">
          <div className="flex items-center">
            <span className="mr-2">{trackingInstructions}</span>
            <button 
              onClick={resetTrackingMode}
              className="text-white bg-red-500 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Pin Form Modal */}
      {showPinForm && selectedLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border ${styles.modalBorder}`}>
            <div className={`py-2 px-4 ${styles.modalHeader}`}>
              <div className="flex justify-between items-center">
                <h3 className={`font-medium ${styles.modalTitle}`}>Add Location Pin</h3>
                <button 
                  onClick={() => setShowPinForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              <PinForm 
                location={selectedLocation}
                onSubmit={handlePinSubmit}
                onCancel={() => setShowPinForm(false)}
                theme={theme}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Share Location Modal */}
      {showShareModal && locationToShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border ${styles.modalBorder}`}>
            <div className={`py-2 px-4 ${styles.modalHeader}`}>
              <div className="flex justify-between items-center">
                <h3 className={`font-medium ${styles.modalTitle}`}>Share Location</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700"
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
                    ? `border-b-2 border-b-${theme === 'GTA5' ? 'gta-primary' : 
                                         theme === 'RDR2' ? 'rdr2-primary' : 
                                         theme === 'RDR' ? 'rdr-primary' : 
                                         theme === 'Cyberpunk2077' ? 'cyberpunk-primary' : 'blue-500'} -mb-px font-medium` 
                    : 'text-gray-500'}`}
                >
                  Share by Link
                </button>
                <button
                  onClick={() => setShareOption('iframe')}
                  className={`px-4 py-2 ${shareOption === 'iframe' 
                    ? `border-b-2 border-b-${theme === 'GTA5' ? 'gta-primary' : 
                                           theme === 'RDR2' ? 'rdr2-primary' : 
                                           theme === 'RDR' ? 'rdr-primary' : 
                                           theme === 'Cyberpunk2077' ? 'cyberpunk-primary' : 'blue-500'} -mb-px font-medium` 
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
                    value={generateShareLink(locationToShare)}
                    className="flex-1 p-2 border rounded-l text-sm bg-gray-50"
                  />
                  <button
                    onClick={copyShareLink}
                    className={`px-3 py-2 rounded-r ${styles.actionBtn}`}
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
                    value={generateIframeHTML(locationToShare)}
                    className="w-full p-2 border rounded text-sm bg-gray-50 h-32 font-mono"
                  />
                  <button
                    onClick={copyShareLink}
                    className={`mt-2 px-3 py-2 rounded ${styles.actionBtn} w-full`}
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
                    value={locationName || ''}
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>
                <button
                  onClick={saveSharedLocation}
                  className={`w-full py-2 px-4 rounded ${styles.actionBtn} mb-4`}
                >
                  Save Location
                </button>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className={`px-4 py-2 rounded ${styles.cancelBtn}`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 