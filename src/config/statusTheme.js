// src/config/statusTheme.js - Centralized Fleet Status Theming & Styles (Single Source of Truth)

export const STATUS_THEMES = {
  moving: {
    key: 'moving',
    label: 'Moving',
    hex: '#10b981', // emerald-500
    dotClass: 'bg-emerald-500',
    pillClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300/50',
    cardClass: {
      normal: 'bg-emerald-500/[0.04] border-emerald-500/25 hover:border-emerald-500/50',
      selected: 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/50 shadow-sm',
    },
    gaugeColor: '#10b981',
  },
  idle: {
    key: 'idle',
    label: 'Idle',
    hex: '#f59e0b', // amber-500
    dotClass: 'bg-amber-500',
    pillClass: 'bg-amber-100 text-amber-800 border border-amber-300/50',
    cardClass: {
      normal: 'bg-amber-500/[0.04] border-amber-500/25 hover:border-amber-500/50',
      selected: 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50 shadow-sm',
    },
    gaugeColor: '#f59e0b',
  },
  stopped: {
    key: 'stopped',
    label: 'Stopped',
    hex: '#f43f5e', // rose-500
    dotClass: 'bg-rose-500',
    pillClass: 'bg-rose-100 text-rose-800 border border-rose-300/50',
    cardClass: {
      normal: 'bg-rose-500/[0.04] border-rose-500/25 hover:border-rose-500/50',
      selected: 'bg-rose-500/10 border-rose-500 ring-1 ring-rose-500/50 shadow-sm',
    },
    gaugeColor: '#f43f5e',
  },
  offline: {
    key: 'offline',
    label: 'Offline',
    hex: '#9ca3af', // gray-400
    dotClass: 'bg-gray-400',
    pillClass: 'bg-gray-100 text-gray-700 border border-gray-300/50',
    cardClass: {
      normal: 'bg-gray-500/[0.03] border-gray-300 hover:border-gray-400',
      selected: 'bg-gray-500/10 border-gray-400 ring-1 ring-gray-400/50 shadow-sm',
    },
    gaugeColor: '#9ca3af',
  },
}

export function getStatusTheme(status) {
  return STATUS_THEMES[status] || STATUS_THEMES.offline
}

