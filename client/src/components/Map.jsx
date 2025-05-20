import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle, ZoomControl, LayersControl, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import RDR2MapStyle from './RDR2MapStyle';

// Fix for default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom theme-based icons
const themeIcons = {
  GTA5: new L.Icon({
    iconUrl: 'https://i.imgur.com/HXkZtT2.png',
    iconSize: [30, 46],
    iconAnchor: [15, 46],
    popupAnchor: [0, -46],
  }),
  RDR2: new L.Icon({
    iconUrl: '/icons/rdr2/location-marker.svg',
    iconSize: [30, 46],
    iconAnchor: [15, 46],
    popupAnchor: [0, -46],
  }),
  RDR: new L.Icon({
    iconUrl: 'https://i.imgur.com/9KxPMvo.png',
    iconSize: [30, 46],
    iconAnchor: [15, 46],
    popupAnchor: [0, -46],
  }),
  Cyberpunk2077: new L.Icon({
    iconUrl: 'https://i.imgur.com/xU1Jr6S.png',
    iconSize: [30, 46],
    iconAnchor: [15, 46],
    popupAnchor: [0, -46],
  }),
};

// More theme icons based on RDR2
const rdr2WaypointIcon = new L.Icon({
  iconUrl: '/icons/rdr2/waypoint.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Pin icons
const pinIcons = {
  GTA5: new L.Icon({
    iconUrl: 'https://i.imgur.com/HXkZtT2.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  RDR2: new L.Icon({
    iconUrl: '/icons/rdr2/quest.svg',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  }),
  RDR: new L.Icon({
    iconUrl: 'https://i.imgur.com/9KxPMvo.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  Cyberpunk2077: new L.Icon({
    iconUrl: 'https://i.imgur.com/xU1Jr6S.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
};

// Distance marker icon
const distancePointIcon = new L.Icon({
  iconUrl: '/icons/rdr2/treasure.svg',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

// Start and end point icons
const startPointIcon = new L.Icon({
  iconUrl: '/icons/rdr2/train.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const endPointIcon = new L.Icon({
  iconUrl: '/icons/rdr2/horse.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Theme-based tile layers
const themeTiles = {
  GTA5: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/attributions">CARTO</a>',
    name: 'GTA V Style'
  },
  RDR2: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://opentopomap.org">OpenTopoMap</a>',
    name: 'RDR2 Style'
  },
  RDR: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.arcgis.com/">ArcGIS</a>',
    name: 'RDR Style'
  },
  Cyberpunk2077: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/attributions">CARTO</a>',
    name: 'Cyberpunk Style'
  },
  Satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.arcgis.com/">ArcGIS</a>',
    name: 'Satellite View'
  },
  Street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    name: 'Street View'
  }
};

// Component to update map center when user position changes
function LocationMarker({ position, theme, accuracy }) {
  const map = useMap();
  const firstUpdate = useRef(true);
  
  useEffect(() => {
    if (position) {
      // Only fly to position on first load or when user explicitly updates position
      if (firstUpdate.current) {
        map.flyTo(position, map.getZoom());
        firstUpdate.current = false;
      }
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <>
      <Marker position={position} icon={themeIcons[theme]}>
        <Popup>
          <div className="text-center">
            <div className="font-semibold mb-2">Your Current Location</div>
            <div className="text-sm text-gray-600">
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </div>
            {accuracy && (
              <div className="text-xs text-gray-500 mt-1">
                Accuracy: ±{accuracy.toFixed(1)}m
              </div>
            )}
          </div>
        </Popup>
      </Marker>
      {accuracy && (
        <Circle 
          center={position} 
          radius={accuracy} 
          pathOptions={{ 
            color: theme === 'GTA5' ? '#00CCFF' : 
                  theme === 'RDR2' ? '#D2A86E' : 
                  theme === 'RDR' ? '#B8860B' : 
                  theme === 'Cyberpunk2077' ? '#FFFF00' : '#1E88E5',
            fillColor: theme === 'GTA5' ? '#00CCFF' : 
                      theme === 'RDR2' ? '#D2A86E' : 
                      theme === 'RDR' ? '#B8860B' : 
                      theme === 'Cyberpunk2077' ? '#FFFF00' : '#1E88E5',
            fillOpacity: 0.15,
            weight: 1
          }}
        />
      )}
    </>
  );
}

// Distance measurement component
function DistanceMeasurement({ points, theme }) {
  const map = useMap();
  
  // Calculate total distance
  const getTotalDistance = () => {
    if (points.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const from = L.latLng(points[i].lat, points[i].lng);
      const to = L.latLng(points[i+1].lat, points[i+1].lng);
      totalDistance += from.distanceTo(to);
    }
    
    return totalDistance;
  };
  
  // Format distance for display
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters.toFixed(1)} m`;
    } else {
      return `${(meters / 1000).toFixed(2)} km`;
    }
  };
  
  // Add distance popups when points are added
  useEffect(() => {
    if (points.length >= 2) {
      const lastIndex = points.length - 1;
      const lastPoint = L.latLng(points[lastIndex].lat, points[lastIndex].lng);
      const prevPoint = L.latLng(points[lastIndex-1].lat, points[lastIndex-1].lng);
      const distance = lastPoint.distanceTo(prevPoint);
      
      const popup = L.popup({
        closeButton: false,
        autoPan: false,
        className: 'distance-popup'
      })
        .setLatLng([
          (points[lastIndex].lat + points[lastIndex-1].lat) / 2,
          (points[lastIndex].lng + points[lastIndex-1].lng) / 2
        ])
        .setContent(`<div class="text-xs font-bold">${formatDistance(distance)}</div>`)
        .openOn(map);
      
      return () => {
        map.closePopup(popup);
      };
    }
  }, [points, map]);
  
  if (points.length < 2) return null;
  
  const polylinePositions = points.map(p => [p.lat, p.lng]);
  
  // Create polyline options based on theme
  const measurePolylineOptions = {
    color: theme === 'GTA5' ? '#FF00CC' : 
           theme === 'RDR2' ? '#8B4513' : 
           theme === 'RDR' ? '#704214' : 
           theme === 'Cyberpunk2077' ? '#FF00FF' : '#FF5722',
    weight: 3,
    opacity: 0.8,
    dashArray: '5, 10',
  };
  
  return (
    <>
      <Polyline positions={polylinePositions} pathOptions={measurePolylineOptions} />
      
      {points.map((point, index) => (
        <Marker 
          key={`measure-${index}`}
          position={[point.lat, point.lng]} 
          icon={distancePointIcon}
        >
          <Popup>
            <div className="text-center">
              <div className="font-semibold mb-1">Point {index + 1}</div>
              {index > 0 && (
                <div className="text-xs text-gray-600 mb-1">
                  Distance from previous: {formatDistance(
                    L.latLng(point.lat, point.lng)
                      .distanceTo(L.latLng(points[index-1].lat, points[index-1].lng))
                  )}
                </div>
              )}
              <div className="text-xs text-gray-600">
                {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Total distance display at last point */}
      {points.length >= 2 && (
        <Popup
          position={[points[points.length-1].lat, points[points.length-1].lng]}
          closeButton={false}
          autoPan={false}
          className="total-distance-popup"
          offset={[0, -10]}
        >
          <div className="text-sm font-bold">
            Total: {formatDistance(getTotalDistance())}
          </div>
        </Popup>
      )}
    </>
  );
}

// Directions component
function DirectionsComponent({ points, theme }) {
  const map = useMap();
  const routingControlRef = useRef(null);
  
  useEffect(() => {
    // Only create routing when we have start and end points
    if (points.length >= 2) {
      const start = [points[0].lat, points[0].lng];
      const end = [points[1].lat, points[1].lng];
      
      // Remove previous routing control if it exists
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
      
      // Create new routing control
      const routeColor = theme === 'GTA5' ? '#00CCFF' : 
                          theme === 'RDR2' ? '#D2A86E' : 
                          theme === 'RDR' ? '#B8860B' : 
                          theme === 'Cyberpunk2077' ? '#FFFF00' : '#1E88E5';
      
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1])
        ],
        routeWhileDragging: true,
        showAlternatives: true,
        addWaypoints: false,
        lineOptions: {
          styles: [
            { color: routeColor, opacity: 0.7, weight: 6 }
          ]
        },
        altLineOptions: {
          styles: [
            { color: theme === 'GTA5' ? '#FF00CC' : 
                     theme === 'RDR2' ? '#8B4513' : 
                     theme === 'RDR' ? '#704214' : 
                     theme === 'Cyberpunk2077' ? '#FF00FF' : '#757575',
              opacity: 0.6,
              weight: 4 }
          ]
        },
        createMarker: (i, waypoint, n) => {
          const icon = i === 0 ? startPointIcon : endPointIcon;
          return L.marker(waypoint.latLng, {
            draggable: true,
            icon: icon
          });
        }
      }).addTo(map);
      
      routingControlRef.current = routingControl;
    }
    
    // Cleanup routing control on unmount or when points change
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [points, map, theme]);
  
  return null;
}

// Special Feature Display component
function FeatureDisplay({ feature, theme }) {
  const map = useMap();
  
  useEffect(() => {
    if (feature && feature.position) {
      map.flyTo([feature.position.lat, feature.position.lng], 
                feature.zoom || map.getZoom());
    }
  }, [feature, map]);
  
  if (!feature) return null;
  
  // If it's a shared location, show a marker
  if (feature.type === 'shared-location') {
    return (
      <Marker 
        position={[feature.position.lat, feature.position.lng]}
        icon={L.divIcon({
          className: 'shared-location-marker',
          html: `<div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white pulse-animation">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })}
      >
        <Popup>
          <div className="text-center">
            <h3 className="font-medium">Shared Location</h3>
            <p className="text-gray-600 text-sm">
              Lat: {feature.position.lat.toFixed(6)}<br />
              Lng: {feature.position.lng.toFixed(6)}
            </p>
          </div>
        </Popup>
      </Marker>
    );
  }
  
  return null;
}

// Main Map Component
export default function Map({ 
  theme = 'GTA5', 
  userLocations = [], 
  pins = [], 
  sharedLocations = [],
  onMapClick,
  currentPosition,
  trackingMode,
  trackingPoints = [],
  selectedFeature,
  onResetTracking
}) {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef(null);
  
  // Initialize with user's current position or default
  useEffect(() => {
    if (currentPosition) {
      setPosition([currentPosition.lat, currentPosition.lng]);
    } else {
      locateUser();
    }
  }, [currentPosition]);
  
  // Locate user
  const locateUser = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        setAccuracy(pos.coords.accuracy);
        
        // If map instance available, fly to user location
        if (mapRef.current) {
          mapRef.current.flyTo(newPos, 15);
        }
      },
      (err) => {
        console.error('Error getting location:', err);
        setPosition([51.505, -0.09]); // Default position (London)
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
    );
  };

  // Handle map click for various actions
  const handleMapClick = (e) => {
    const clickedPos = {
      lat: e.latlng.lat,
      lng: e.latlng.lng
    };
    
    // Pass click to parent component
    if (onMapClick) {
      onMapClick(clickedPos);
    }
  };
  
  // Handle search
  const handleSearch = (searchQuery) => {
    // In a real app, this would call a geocoding API like MapBox, Google Maps, or Nominatim
    console.log('Searching for:', searchQuery);
    
    // Example implementation using Nominatim API
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => {
        const results = data.slice(0, 5).map(place => ({
          place: place.display_name,
          location: [parseFloat(place.lat), parseFloat(place.lon)]
        }));
        setSearchResults(results);
        setShowSearchResults(true);
      })
      .catch(error => {
        console.error('Error searching for location:', error);
        // Fallback to mock results
        const mockResults = [
          { place: 'Central Park, New York', location: [40.785091, -73.968285] },
          { place: 'Empire State Building, New York', location: [40.748817, -73.985428] },
          { place: 'Statue of Liberty, New York', location: [40.689247, -74.044502] }
        ];
        setSearchResults(mockResults);
        setShowSearchResults(true);
      });
  };
  
  // Create polyline from user locations
  const pathPositions = useMemo(() => 
    userLocations.map(loc => [loc.lat, loc.lng]), 
    [userLocations]
  );
  
  // Theme-based polyline options
  const polylineOptions = {
    GTA5: { color: '#00CCFF', weight: 4, opacity: 0.7, dashArray: '10, 5' },
    RDR2: { color: '#D2A86E', weight: 4, opacity: 0.7, dashArray: '10, 5' },
    RDR: { color: '#B8860B', weight: 4, opacity: 0.7, dashArray: '10, 5' },
    Cyberpunk2077: { color: '#FFFF00', weight: 4, opacity: 0.7, dashArray: '10, 5' },
  };

  return (
    <div className="w-full h-full relative">
      {/* Search Box */}
      <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-auto md:w-96 z-20">
        <form onSubmit={(e) => {
          e.preventDefault();
          const searchInput = e.target.elements.search.value;
          if (searchInput.trim()) {
            handleSearch(searchInput);
          }
        }} className="flex">
          <input
            type="text"
            name="search"
            placeholder="Search locations..."
            className="w-full p-2 md:p-3 text-sm md:text-base rounded-l-lg border-r-0 bg-white/90 backdrop-blur-sm shadow-lg focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 md:p-3 rounded-r-lg shadow-lg flex items-center justify-center"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>
      
      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <div className="absolute top-12 md:top-16 left-2 right-2 md:left-4 md:right-auto md:w-96 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
          <div className="flex justify-between items-center mb-2 border-b pb-1">
            <h3 className="font-semibold text-gray-700 text-sm md:text-base">Search Results</h3>
            <button 
              onClick={() => setShowSearchResults(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <ul>
            {searchResults.map((result, idx) => (
              <li 
                key={idx}
                className="p-1 md:p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center text-sm md:text-base"
                onClick={() => {
                  if (mapRef.current) {
                    mapRef.current.flyTo(result.location, 15);
                  }
                  setShowSearchResults(false);
                }}
              >
                <div className="bg-blue-600 text-white p-1 rounded-full mr-2 flex items-center justify-center">
                  <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <span>{result.place}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Map Tools */}
      <div className="absolute bottom-16 md:bottom-24 right-2 md:right-4 z-20 flex flex-col space-y-2">
        <button 
          onClick={locateUser}
          className="p-2 md:p-3 bg-white/90 rounded-full shadow-lg hover:bg-white"
          title="Find my location"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button 
          onClick={() => onMapClick && onMapClick({ type: 'share', lat: position?.[0] || 51.505, lng: position?.[1] || -0.09 })}
          className="p-2 md:p-3 bg-white/90 text-blue-600 rounded-full shadow-lg hover:bg-white"
          title="Share Location"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>

        <button 
          onClick={() => onResetTracking && onResetTracking()}
          className={`p-2 md:p-3 ${trackingMode ? 'bg-red-500 text-white' : 'bg-white/90 text-blue-600'} rounded-full shadow-lg hover:bg-opacity-100`}
          title={trackingMode ? "Cancel current action" : "Reset tracking"}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Map Container */}
      <MapContainer
        center={position || [51.505, -0.09]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        whenCreated={map => {
          mapRef.current = map;
        }}
        onClick={handleMapClick}
      >
        {/* Apply RDR2 styling when that theme is active */}
        {theme === 'RDR2' && <RDR2MapStyle map={mapRef.current} />}
        
        {/* Add ZoomControl in bottom right */}
        <ZoomControl position="bottomright" />
        
        {/* Layer controls */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name={themeTiles[theme].name}>
            <TileLayer
              attribution={themeTiles[theme].attribution}
              url={themeTiles[theme].url}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution={themeTiles.Satellite.attribution}
              url={themeTiles.Satellite.url}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Street Map">
            <TileLayer
              attribution={themeTiles.Street.attribution}
              url={themeTiles.Street.url}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {/* User's current location */}
        {position && (
          <LocationMarker position={position} theme={theme} accuracy={accuracy} />
        )}
        
        {/* Historical path */}
        {pathPositions.length > 1 && (
          <Polyline positions={pathPositions} pathOptions={polylineOptions[theme] || polylineOptions.default} />
        )}
        
        {/* User pins/markers */}
        {pins.map((pin, index) => (
          <Marker 
            key={`pin-${index}`}
            position={[pin.lat, pin.lng]}
            icon={pinIcons[theme] || pinIcons.GTA5}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold mb-1">{pin.note}</div>
                <div className="text-xs text-gray-600">
                  {new Date(pin.timestamp).toLocaleString()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Shared Locations */}
        {sharedLocations.map((location, index) => (
          <Marker 
            key={`shared-${index}`}
            position={[location.lat, location.lng]}
            icon={L.divIcon({
              className: 'shared-location-marker',
              html: `<div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })}
          >
            <Popup>
              <div className="text-center">
                <div className="font-semibold mb-1">{location.name || 'Shared Location'}</div>
                <div className="text-xs text-gray-600">
                  {new Date(location.timestamp).toLocaleString()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Distance Measurement feature */}
        {trackingMode === 'track-distance' && trackingPoints.length > 0 && (
          <DistanceMeasurement points={trackingPoints} theme={theme} />
        )}
        
        {/* Directions feature */}
        {trackingMode === 'directions' && trackingPoints.length >= 2 && (
          <DirectionsComponent points={trackingPoints} theme={theme} />
        )}
        
        {/* Special feature display */}
        {selectedFeature && (
          <FeatureDisplay feature={selectedFeature} theme={theme} />
        )}
      </MapContainer>
    </div>
  );
} 