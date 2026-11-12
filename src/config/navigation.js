// src/config/navigation.js - Centralized Navigation Schema for Enterprise Fleet System

export const navigationSections = [
  {
    id: 'tracking',
    title: 'Tracking & Map',
    items: [
      { id: 'overview', label: 'Overview', icon: 'dashboard', badge: null },
      { id: 'live-map', label: 'Live Map', icon: 'near_me', badge: null },
      { id: 'geofences', label: 'Geofences', icon: 'polyline', badge: null },
      { id: 'landmarks', label: 'Landmarks', icon: 'location_on', badge: null },
      { id: 'trip-history', label: 'Trip History', icon: 'history', badge: null },
    ],
  },
  {
    id: 'assets',
    title: 'Fleet Assets',
    items: [
      { id: 'vehicles', label: 'Vehicles', icon: 'local_shipping', badge: null },
      { id: 'drivers', label: 'Drivers', icon: 'badge', badge: null },
      { id: 'fuel', label: 'Fuel & Energy', icon: 'local_gas_station', badge: null },
      { id: 'maintenance', label: 'Maintenance', icon: 'build', badge: null },
    ],
  },
  {
    id: 'safety',
    title: 'Safety & Alerts',
    items: [
      { id: 'alerts', label: 'Alerts', icon: 'notifications_active', badge: 14, badgeType: 'error' },
      { id: 'safety-score', label: 'Safety Score', icon: 'verified_user', badge: null },
    ],
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    items: [
      { id: 'trip-reports', label: 'Trip Reports', icon: 'description', badge: null },
      { id: 'fuel-analytics', label: 'Fuel Analytics', icon: 'monitoring', badge: null },
    ],
  },
  {
    id: 'system',
    title: 'System & Support',
    items: [
      { id: 'settings', label: 'Settings', icon: 'tune', badge: null },
      { id: 'tickets', label: 'Support Tickets', icon: 'confirmation_number', badge: 2, badgeType: 'info' },
      { id: 'docs', label: 'Help & Docs', icon: 'help', badge: null },
    ],
  },
]

