<script setup>
/**
 * @deprecated This component has been relocated to src/screens/fleetmap/MapCanvas.vue
 * Please import from src/screens/fleetmap/MapCanvas.vue directly.
 */
import MapCanvas from '../screens/fleetmap/MapCanvas.vue'
defineProps(['vehicles', 'selectedVehicleId'])
defineEmits(['select-vehicle', 'map-ready'])
</script>

<template>
  <MapCanvas v-bind="$props" v-on="$attrs" />
</template>
