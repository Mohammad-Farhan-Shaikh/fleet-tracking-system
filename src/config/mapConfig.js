// src/config/mapConfig.js - Leaflet OSM Standard & Hybrid Configuration for Fleet Tracking

export const MAP_PROVIDERS = {
  LEAFLET: 'leaflet',
  GOOGLE_MAPS: 'google_maps', // Plug & play ready for future
}

export const ACTIVE_PROVIDER = MAP_PROVIDERS.LEAFLET

// Pure Leaflet Tile Layers: Normal OSM & Hybrid Satellite
export const TILE_LAYERS = {
  osm_normal: {
    id: 'osm_normal',
    name: 'Normal Street',
    provider: 'leaflet',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    hasOverlay: false,
  },
  hybrid_satellite: {
    id: 'hybrid_satellite',
    name: 'Hybrid Satellite',
    provider: 'leaflet',
    // High-res imagery base
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    // Transparent road & boundaries label overlay
    overlayUrl: 'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri, OSM Contributors',
    maxZoom: 19,
    hasOverlay: true,
  },
}

// Available Providers for future expansion
export const AVAILABLE_MAP_PROVIDERS = [
  { id: 'leaflet', name: 'Leaflet (OSM)', active: true },
  { id: 'google', name: 'Google Maps', active: false, badge: 'Soon' },
]

// Default initial viewport (Midwest Fleet Corridor - Chicago/Indianapolis)
export const DEFAULT_VIEWPORT = {
  lat: 40.5,
  lng: -86.5,
  zoom: 7,
}
