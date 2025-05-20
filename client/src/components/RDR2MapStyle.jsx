import { useEffect } from 'react';
import L from 'leaflet';

export default function RDR2MapStyle({ map }) {
  useEffect(() => {
    if (!map) return;

    // Add RDR2 styling class to map container
    map.getContainer().classList.add('theme-rdr2');

    // Apply RDR2 styling to map
    map.getContainer().style.background = '#DEC29B'; // Land color

    // Custom pane for map labels to ensure they're styled correctly
    if (!map.getPane('labels')) {
      map.createPane('labels');
      map.getPane('labels').style.zIndex = 650;
      map.getPane('labels').style.pointerEvents = 'none';
    }

    // Register custom icons
    const rdr2Icons = {
      location: L.icon({
        iconUrl: '/icons/rdr2/location-marker.svg',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40]
      }),
      waypoint: L.icon({
        iconUrl: '/icons/rdr2/waypoint.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      quest: L.icon({
        iconUrl: '/icons/rdr2/quest.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      camp: L.icon({
        iconUrl: '/icons/rdr2/camp.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      town: L.icon({
        iconUrl: '/icons/rdr2/town.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      hunt: L.icon({
        iconUrl: '/icons/rdr2/hunt.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      fishing: L.icon({
        iconUrl: '/icons/rdr2/fishing.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      gunShop: L.icon({
        iconUrl: '/icons/rdr2/gun-shop.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      saloon: L.icon({
        iconUrl: '/icons/rdr2/saloon.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      bounty: L.icon({
        iconUrl: '/icons/rdr2/bounty.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      horse: L.icon({
        iconUrl: '/icons/rdr2/horse.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      train: L.icon({
        iconUrl: '/icons/rdr2/train.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      }),
      treasure: L.icon({
        iconUrl: '/icons/rdr2/treasure.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      })
    };

    // Add custom icons to map for access in other components
    map.rdr2Icons = rdr2Icons;

    // Apply RDR2 styling to map elements
    const applyRDR2Styling = () => {
      // Style state & country names
      const stateElements = document.querySelectorAll('.leaflet-tile-pane .state, .leaflet-tile-pane .country');
      stateElements.forEach(el => {
        el.classList.add('state-name');
      });

      // Style city names
      const cityElements = document.querySelectorAll('.leaflet-tile-pane .city, .leaflet-tile-pane .town');
      cityElements.forEach(el => {
        el.classList.add('city-name');
      });

      // Style water features
      const majorWaterElements = document.querySelectorAll('.leaflet-tile-pane .water.major');
      majorWaterElements.forEach(el => {
        el.classList.add('water-major');
      });

      const minorWaterElements = document.querySelectorAll('.leaflet-tile-pane .water.minor, .leaflet-tile-pane .river');
      minorWaterElements.forEach(el => {
        el.classList.add('water-minor');
      });

      // Style other features
      const stationElements = document.querySelectorAll('.leaflet-tile-pane .station');
      stationElements.forEach(el => {
        el.classList.add('station-name');
      });

      const naturalElements = document.querySelectorAll('.leaflet-tile-pane .natural, .leaflet-tile-pane .forest, .leaflet-tile-pane .mountain');
      naturalElements.forEach(el => {
        el.classList.add('natural-feature');
      });

      const viewpointElements = document.querySelectorAll('.leaflet-tile-pane .viewpoint');
      viewpointElements.forEach(el => {
        el.classList.add('viewpoint');
      });

      const fortElements = document.querySelectorAll('.leaflet-tile-pane .fort');
      fortElements.forEach(el => {
        el.classList.add('fort');
      });
    };

    // Apply styling when tiles load
    map.on('tileload', applyRDR2Styling);

    // Clean up
    return () => {
      map.off('tileload', applyRDR2Styling);
      map.getContainer().classList.remove('theme-rdr2');
    };
  }, [map]);

  return null; // This is a utility component, it doesn't render anything
} 