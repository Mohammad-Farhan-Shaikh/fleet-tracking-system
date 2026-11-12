<script setup>
import { ref } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import AppTopHeader from './components/AppTopHeader.vue'
import FleetMapScreen from './screens/fleetmap/FleetMapScreen.vue'

const isSidebarCollapsed = ref(false)
const activeMenu = ref('live-map')
const showFilterPanel = ref(true)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const handleMenuSelect = (menu) => {
  if (menu === 'live-map') {
    if (activeMenu.value === 'live-map') {
      showFilterPanel.value = !showFilterPanel.value
    } else {
      activeMenu.value = 'live-map'
      showFilterPanel.value = true
    }
  } else {
    activeMenu.value = menu
    showFilterPanel.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full">
    <main class="w-full min-h-screen bg-background relative">
      <div class="flex flex-col w-full h-screen overflow-hidden select-none">
        <!-- 1. Full Top Navigation Header Bar across top (Stays 100% stable, never shifts) -->
        <div class="w-full flex flex-row items-center bg-surface-container-lowest border-b border-gray-100 z-20">
          <!-- Top Left Brand & Toggle: FLEET TRACKING + HAMBURGER (Fixed always, never shrinks or changes) -->
          <div
            class="h-11 w-56 flex items-center justify-between px-3 shrink-0 select-none"
          >
            <div class="flex items-center gap-2 overflow-hidden">
              <button
                @click="toggleSidebar"
                class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer shrink-0"
                title="Toggle Sidebar"
              >
                <span class="material-symbols-outlined text-[19px]">menu</span>
              </button>
              <span
                class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold truncate"
                >Fleet Tracking System</span
              >
            </div>
          </div>

          <!-- Rest of Header (Breadcrumb, Status Counts, Actions, User) -->
          <AppTopHeader
            :active-menu="activeMenu"
            class="flex-1 min-w-0 !border-b-0"
          />
        </div>

        <!-- 2. Body Area (Sidebar Menu + Active Screen Viewport) -->
        <div class="flex flex-row w-full flex-1 min-h-0 relative overflow-hidden bg-surface">
          <!-- PRIMARY NAVIGATION DOCK (Highlighted Menu Area) -->
          <AppSidebar
            :is-collapsed="isSidebarCollapsed"
            :active-menu="activeMenu"
            @select-menu="handleMenuSelect"
          />

          <!-- ACTIVE SCREEN VIEW (Fleet Map Live Screen) -->
          <FleetMapScreen
            v-if="activeMenu === 'live-map'"
            :show-filter-panel="showFilterPanel"
          />

          <!-- Fallback view for other menu items -->
          <div
            v-else
            class="flex-1 h-full flex items-center justify-center bg-surface-container-low text-outline"
          >
            <div class="flex flex-col items-center gap-2">
              <span class="material-symbols-outlined text-[36px]">pending</span>
              <span class="text-[13px] font-medium">Screen Under Construction</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
