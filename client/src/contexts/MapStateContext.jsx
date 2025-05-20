import { createContext, useContext, useReducer } from 'react';

// Create map state context
const MapStateContext = createContext();

// Action types
const SET_ACTIVE_MODE = 'SET_ACTIVE_MODE';
const SET_SELECTED_LOCATION = 'SET_SELECTED_LOCATION';
const SET_VIEWPORT = 'SET_VIEWPORT';
const ADD_MARKER = 'ADD_MARKER';
const UPDATE_MARKER = 'UPDATE_MARKER';
const REMOVE_MARKER = 'REMOVE_MARKER';
const SET_ROUTE = 'SET_ROUTE';
const CLEAR_ROUTE = 'CLEAR_ROUTE';
const ADD_TRACKING_POINT = 'ADD_TRACKING_POINT';
const CLEAR_TRACKING_POINTS = 'CLEAR_TRACKING_POINTS';
const ADD_TO_HISTORY = 'ADD_TO_HISTORY';
const SET_SELECTED_MARKER = 'SET_SELECTED_MARKER';

// Reducer for complex state management
const mapStateReducer = (state, action) => {
  switch (action.type) {
    case SET_ACTIVE_MODE:
      return { ...state, activeMode: action.payload };
      
    case SET_SELECTED_LOCATION:
      return { ...state, selectedLocation: action.payload };
      
    case SET_VIEWPORT:
      return { ...state, viewport: { ...state.viewport, ...action.payload } };
      
    case ADD_MARKER:
      return { ...state, markers: [...state.markers, action.payload] };
      
    case UPDATE_MARKER:
      return {
        ...state,
        markers: state.markers.map(marker => 
          marker.id === action.payload.id ? { ...marker, ...action.payload } : marker
        )
      };
      
    case REMOVE_MARKER:
      return {
        ...state, 
        markers: state.markers.filter(marker => marker.id !== action.payload)
      };
      
    case SET_ROUTE:
      return { ...state, currentRoute: action.payload };
      
    case CLEAR_ROUTE:
      return { ...state, currentRoute: null };
      
    case ADD_TRACKING_POINT:
      return { 
        ...state, 
        trackingPoints: [...state.trackingPoints, action.payload]
      };
      
    case CLEAR_TRACKING_POINTS:
      return { ...state, trackingPoints: [] };
      
    case ADD_TO_HISTORY:
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 50) // Keep last 50 items
      };
      
    case SET_SELECTED_MARKER:
      return { ...state, selectedMarker: action.payload };
      
    default:
      return state;
  }
};

// Initial state
const initialState = {
  activeMode: null, // 'add-marker', 'measure', 'directions', etc.
  selectedLocation: null,
  selectedMarker: null,
  viewport: {
    center: [40.7128, -74.0060], // NYC default
    zoom: 13
  },
  markers: [],
  currentRoute: null,
  trackingPoints: [],
  history: []
};

export function MapStateProvider({ children }) {
  const [state, dispatch] = useReducer(mapStateReducer, initialState);
  
  // Expose state and dispatch as value
  const value = { 
    state, 
    dispatch,
    
    // Active mode
    activeMode: state.activeMode,
    setActiveMode: (mode) => {
      dispatch({ type: SET_ACTIVE_MODE, payload: mode });
      
      // Reset tracking points when changing modes
      if (mode !== 'measure' && mode !== 'directions') {
        dispatch({ type: CLEAR_TRACKING_POINTS });
      }
    },
    
    // Selected location
    selectedLocation: state.selectedLocation,
    setSelectedLocation: (location) => {
      dispatch({ type: SET_SELECTED_LOCATION, payload: location });
      // Add to history
      dispatch({ 
        type: ADD_TO_HISTORY, 
        payload: { 
          type: 'location_select', 
          location, 
          timestamp: new Date().toISOString() 
        } 
      });
    },
    
    // Markers
    markers: state.markers,
    addMarker: (marker) => {
      dispatch({ type: ADD_MARKER, payload: marker });
      // Add to history
      dispatch({ 
        type: ADD_TO_HISTORY, 
        payload: { 
          type: 'marker_add', 
          marker, 
          timestamp: new Date().toISOString() 
        } 
      });
    },
    updateMarker: (marker) => {
      dispatch({ type: UPDATE_MARKER, payload: marker });
    },
    removeMarker: (markerId) => {
      dispatch({ type: REMOVE_MARKER, payload: markerId });
    },
    
    // Selected marker
    selectedMarker: state.selectedMarker,
    selectMarker: (marker) => {
      dispatch({ type: SET_SELECTED_MARKER, payload: marker });
    },
    
    // Viewport
    viewport: state.viewport,
    setViewport: (viewport) => {
      dispatch({ type: SET_VIEWPORT, payload: viewport });
    },
    
    // Route
    currentRoute: state.currentRoute,
    setRoute: (route) => {
      dispatch({ type: SET_ROUTE, payload: route });
      // Add to history
      dispatch({ 
        type: ADD_TO_HISTORY, 
        payload: { 
          type: 'route_create', 
          route, 
          timestamp: new Date().toISOString() 
        } 
      });
    },
    clearRoute: () => {
      dispatch({ type: CLEAR_ROUTE });
    },
    
    // Tracking points
    trackingPoints: state.trackingPoints,
    addTrackingPoint: (point) => {
      dispatch({ type: ADD_TRACKING_POINT, payload: point });
    },
    clearTrackingPoints: () => {
      dispatch({ type: CLEAR_TRACKING_POINTS });
    },
    
    // History
    history: state.history
  };
  
  return (
    <MapStateContext.Provider value={value}>
      {children}
    </MapStateContext.Provider>
  );
}

// Custom hook to use the map state context
export function useMapState() {
  const context = useContext(MapStateContext);
  
  if (!context) {
    throw new Error('useMapState must be used within a MapStateProvider');
  }
  
  return context;
} 