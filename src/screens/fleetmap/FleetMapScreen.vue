<script setup>
import { useFleet } from '../../composables/useFleet'
import FilterPanel from '../../components/FilterPanel.vue'
import TelematicsDrawer from '../../components/TelematicsDrawer.vue'
import MapCanvas from './MapCanvas.vue'

const props = defineProps({
  showFilterPanel: {
    type: Boolean,
    default: true,
  },
})

const { vehicles, selectedVehicleId, selectedVehicle, selectVehicle } = useFleet()
</script>

<template>
  <div class="w-full h-full flex flex-row relative overflow-hidden select-none">
    <!-- 1. Secondary Vehicle Filter Drawer Panel -->
    <FilterPanel v-if="showFilterPanel" />

    <!-- 2. Main Live Map Viewport -->
    <main class="flex-1 h-full relative overflow-hidden bg-surface-container-low">
      <!-- Leaflet GIS Map Canvas with Reusable Floating Layers & Tools -->
      <MapCanvas
        :vehicles="vehicles"
        :selected-vehicle-id="selectedVehicleId"
        @select-vehicle="(v) => selectVehicle(v.id)"
      />

      <!-- 3. Floating Telematics Diagnostic Card for Selected Vehicle -->
      <TelematicsDrawer
        v-if="selectedVehicle"
        :vehicle="selectedVehicle"
        @close="selectVehicle(null)"
      />
    </main>
  </div>
</template>

