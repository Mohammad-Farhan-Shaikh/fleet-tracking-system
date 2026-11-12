<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'live-map',
  },
  user: {
    type: Object,
    default: () => ({
      name: 'Jaylon Philips',
      role: 'Fleet Manager',
      initials: 'JP',
    }),
  },
  unreadAlertsCount: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['refresh', 'open-alerts', 'open-help', 'open-profile'])

// Dynamic breadcrumb mapping based on active menu
const breadcrumb = computed(() => {
  const map = {
    overview: { category: 'Tracking', current: 'Overview' },
    'live-map': { category: 'Tracking', current: 'Live Map' },
    geofences: { category: 'Tracking', current: 'Geofences' },
    landmarks: { category: 'Tracking', current: 'Landmarks' },
    'trip-history': { category: 'Tracking', current: 'Trip History' },
    vehicles: { category: 'Fleet Assets', current: 'Vehicles' },
    drivers: { category: 'Fleet Assets', current: 'Drivers' },
    fuel: { category: 'Fleet Assets', current: 'Fuel & Energy' },
    maintenance: { category: 'Fleet Assets', current: 'Maintenance' },
    alerts: { category: 'Safety & Alerts', current: 'Alerts' },
    'safety-score': { category: 'Safety & Alerts', current: 'Safety Score' },
    'trip-reports': { category: 'Reports & Analytics', current: 'Trip Reports' },
    'fuel-analytics': { category: 'Reports & Analytics', current: 'Fuel Analytics' },
    settings: { category: 'System & Support', current: 'Settings' },
    tickets: { category: 'System & Support', current: 'Support Tickets' },
    docs: { category: 'System & Support', current: 'Help & Docs' },
  }

  return map[props.activeMenu] || { category: 'Tracking', current: 'Live Map' }
})
</script>

<template>
  <header
    class="w-full h-11 bg-surface-container-lowest px-space-md flex items-center justify-between shrink-0 select-none z-20"
  >
    <!-- Left: Dynamic Breadcrumb Navigation -->
    <div class="flex items-center gap-space-sm">
      <nav class="flex items-center gap-1.5 text-body-sm font-label-md" aria-label="Breadcrumb">
        <a
          href="#"
          class="flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span class="material-symbols-outlined text-[17px] text-outline">home</span>
          <span class="text-[13px]">{{ breadcrumb.category }}</span>
        </a>

        <span class="material-symbols-outlined text-[14px] text-outline">chevron_right</span>

        <span class="text-[13px] font-semibold text-on-surface">{{ breadcrumb.current }}</span>
      </nav>
    </div>

    <!-- Right: Action Buttons + User Profile -->
    <div class="flex items-center gap-space-sm">
      <!-- Action Buttons: Alerts, Quick Support, Refresh -->
      <div class="flex items-center gap-1 text-on-surface-variant">
        <!-- Alerts with dynamic unread indicator -->
        <button
          @click="emit('open-alerts')"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low hover:text-on-surface transition-colors relative cursor-pointer"
          title="Alerts & Notifications"
        >
          <span class="material-symbols-outlined text-[18px]">notifications</span>
          <span
            v-if="unreadAlertsCount > 0"
            class="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"
          ></span>
        </button>

        <!-- Quick Help & Support Button -->
        <button
          @click="emit('open-help')"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
          title="Quick Help & Support"
        >
          <span class="material-symbols-outlined text-[18px]">help_outline</span>
        </button>

        <!-- Refresh Data Button -->
        <button
          @click="emit('refresh')"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <span class="material-symbols-outlined text-[18px]">sync</span>
        </button>
      </div>

      <div class="h-5 w-px bg-gray-200"></div>

      <!-- Reactive User Profile (Props driven) -->
      <div
        @click="emit('open-profile')"
        class="flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
        title="User Profile"
      >
        <div
          class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-label-md font-bold text-[11px] shrink-0 shadow-xs"
        >
          {{ user.initials }}
        </div>
        <div class="hidden sm:flex flex-col min-w-0">
          <span class="font-label-md text-[12px] text-on-surface font-semibold leading-tight truncate">
            {{ user.name }}
          </span>
          <span class="font-code-sm text-[10px] text-on-surface-variant leading-none truncate">
            {{ user.role }}
          </span>
        </div>
      </div>
    </div>
  </header>
</template>
