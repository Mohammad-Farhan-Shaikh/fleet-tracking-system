<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { TILE_LAYERS, DEFAULT_VIEWPORT } from '../../config/mapConfig'
import { getStatusTheme } from '../../config/statusTheme'
import { mockGeofences } from '../../data/mockVehicles'
import MapLayerTools from './MapLayerTools.vue'
import carIconUrl from '../../assets/cars/car.png'

const props = defineProps({
  vehicles: {
    type: Array,
    default: () => [],
  },
  selectedVehicleId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['select-vehicle', 'map-ready'])

const mapContainer = ref(null)
let leafletMap = null
let currentBaseLayer = null
let currentOverlayLayer = null
let markersMap = new Map()
let geofenceLayerGroup = null

// Layer & Tools State
const activeLayerId = ref('osm_normal')
const showGeofences = ref(true)
const showVehicleLabels = ref(true)

// Create custom DOM Marker: compact clean car icon with constant uniform size
const createCustomMarkerIcon = (vehicle, isSelected) => {
  if (!window.L) return null
  const heading = vehicle.heading || 0

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer select-none" style="width: 28px; height: 28px;">
      <!-- Pure Compact Car PNG Image (Same normal size for all vehicles) -->
      <img 
        src="${carIconUrl}" 
        alt="Vehicle"
        class="w-5 h-5 object-contain transition-transform duration-300"
        style="transform: rotate(${heading}deg);" 
      />

      <!-- Vehicle ID Floating Badge -->
      ${
        showVehicleLabels.value
          ? `<div class="absolute -bottom-2.5 font-mono text-[8px] font-bold px-1 py-0.2 rounded shadow-sm whitespace-nowrap pointer-events-none ${
              isSelected ? 'bg-teal-700 text-white shadow' : 'bg-gray-900/85 text-white'
            }">
              ${vehicle.id}
            </div>`
          : ''
      }
    </div>
  `

  return window.L.divIcon({
    html,
    className: 'custom-fleet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

// Initialize Leaflet Map
const initMap = () => {
  if (!window.L || !mapContainer.value) return

  leafletMap = window.L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
  }).setView([DEFAULT_VIEWPORT.lat, DEFAULT_VIEWPORT.lng], DEFAULT_VIEWPORT.zoom)

  switchTileLayer(activeLayerId.value)

  geofenceLayerGroup = window.L.layerGroup().addTo(leafletMap)
  renderGeofences()
  renderVehicles()

  emit('map-ready', leafletMap)
}

// Switch between Leaflet OSM Normal & Hybrid Satellite
const switchTileLayer = (layerId) => {
  if (!leafletMap || !window.L) return
  const layerConfig = TILE_LAYERS[layerId]
  if (!layerConfig) return

  if (currentBaseLayer) {
    leafletMap.removeLayer(currentBaseLayer)
    currentBaseLayer = null
  }
  if (currentOverlayLayer) {
    leafletMap.removeLayer(currentOverlayLayer)
    currentOverlayLayer = null
  }

  currentBaseLayer = window.L.tileLayer(layerConfig.url, {
    maxZoom: layerConfig.maxZoom || 19,
    subdomains: 'abc',
  }).addTo(leafletMap)

  if (layerConfig.hasOverlay && layerConfig.overlayUrl) {
    currentOverlayLayer = window.L.tileLayer(layerConfig.overlayUrl, {
      maxZoom: layerConfig.maxZoom || 19,
    }).addTo(leafletMap)
  }

  activeLayerId.value = layerId
}

// Render Geofence zones
const renderGeofences = () => {
  if (!geofenceLayerGroup || !window.L) return
  geofenceLayerGroup.clearLayers()

  if (!showGeofences.value) return

  mockGeofences.forEach((geo) => {
    const polygon = window.L.polygon(geo.coordinates, {
      color: geo.color,
      fillColor: geo.color,
      fillOpacity: 0.14,
      weight: 1.8,
      dashArray: '5, 5',
    })

    polygon.bindTooltip(
      `<div class="font-sans font-bold text-[11px] text-gray-800">${geo.name}</div>`,
      { sticky: true, className: 'geofence-tooltip' }
    )

    geofenceLayerGroup.addLayer(polygon)
  })
}

// Render / Update vehicle markers on the map
const renderVehicles = () => {
  if (!leafletMap || !window.L) return

  const list = props.vehicles.length ? props.vehicles : []

  const activeIds = new Set(list.map((v) => v.id))
  for (const [id, marker] of markersMap.entries()) {
    if (!activeIds.has(id)) {
      leafletMap.removeLayer(marker)
      markersMap.delete(id)
    }
  }

  list.forEach((v) => {
    if (!v.lat || !v.lng) return

    const isSelected = props.selectedVehicleId === v.id
    const icon = createCustomMarkerIcon(v, isSelected)

    if (markersMap.has(v.id)) {
      const marker = markersMap.get(v.id)
      marker.setLatLng([v.lat, v.lng])
      marker.setIcon(icon)
      marker.setZIndexOffset(isSelected ? 1000 : 100)
    } else {
      const marker = window.L.marker([v.lat, v.lng], { icon })
        .addTo(leafletMap)
        .on('click', () => {
          emit('select-vehicle', v)
        })

      marker.bindPopup(`
        <div class="font-sans text-[12px] p-1 flex flex-col gap-1 min-w-[150px]">
          <div class="flex items-center justify-between border-b pb-1 font-bold">
            <span>${v.id}</span>
            <span style="color: ${getStatusTheme(v.status).hex};">${v.speed} ${v.speedUnit || 'MPH'}</span>
          </div>
          <div class="text-gray-600 font-medium">${v.model}</div>
          <div class="text-gray-500 text-[11px]">${v.driver || 'Unassigned'}</div>
          <div class="text-secondary font-semibold text-[11px]">${v.route || ''}</div>
        </div>
      `)

      markersMap.set(v.id, marker)
    }
  })
}

// Center map on selected vehicle
const centerOnVehicle = (vehicleId) => {
  if (!leafletMap || !vehicleId) return
  const target = props.vehicles.find((v) => v.id === vehicleId)
  if (target && target.lat && target.lng) {
    leafletMap.flyTo([target.lat, target.lng], 13, {
      duration: 1.2,
      easeLinearity: 0.25,
    })
  }
}

// Watchers
watch(() => props.vehicles, () => renderVehicles(), { deep: true })

watch(
  () => props.selectedVehicleId,
  (newId) => {
    renderVehicles()
    if (newId) centerOnVehicle(newId)
  }
)

watch(showGeofences, () => renderGeofences())
watch(showVehicleLabels, () => renderVehicles())

// Bottom-Right Controls Actions
const zoomIn = () => leafletMap && leafletMap.zoomIn()
const zoomOut = () => leafletMap && leafletMap.zoomOut()
const resetView = () => {
  if (leafletMap) {
    leafletMap.flyTo([DEFAULT_VIEWPORT.lat, DEFAULT_VIEWPORT.lng], DEFAULT_VIEWPORT.zoom)
  }
}

onMounted(() => {
  if (window.L) {
    initMap()
  } else {
    const timer = setInterval(() => {
      if (window.L) {
        clearInterval(timer)
        initMap()
      }
    }, 100)
  }
})

onUnmounted(() => {
  if (leafletMap) {
    leafletMap.remove()
    leafletMap = null
  }
})

defineExpose({
  centerOnVehicle,
  switchTileLayer,
  resetView,
})
</script>

<template>
  <div class="relative w-full h-full overflow-hidden select-none bg-surface-container-low">
    <!-- 1. Real Leaflet Map Container -->
    <div ref="mapContainer" class="w-full h-full z-0"></div>

    <!-- 2. TOP-RIGHT: SEPARATE REUSABLE LAYERS & TOOLS COMPONENT -->
    <MapLayerTools
      :active-layer-id="activeLayerId"
      v-model:show-geofences="showGeofences"
      v-model:show-vehicle-labels="showVehicleLabels"
      @switch-layer="switchTileLayer"
    />

    <!-- 3. BOTTOM-RIGHT: ENTERPRISE NAVIGATION CONTROLS (Reset View + Zoom In/Out) -->
    <div class="absolute bottom-5 right-5 z-20 flex flex-col gap-2 items-center select-none">
      <!-- Reset / Center Corridor Button -->
      <button
        @click="resetView"
        class="w-10 h-10 rounded-xl bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:text-teal-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        title="Reset Map Corridor"
      >
        <span class="material-symbols-outlined text-[20px]">fit_screen</span>
      </button>

      <!-- Zoom In & Out Controls -->
      <div class="flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <button
          @click="zoomIn"
          class="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-teal-700 hover:bg-gray-100 border-b border-gray-100 active:scale-95 transition-all cursor-pointer"
          title="Zoom in"
        >
          <span class="material-symbols-outlined text-[19px]">add</span>
        </button>
        <button
          @click="zoomOut"
          class="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-teal-700 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
          title="Zoom out"
        >
          <span class="material-symbols-outlined text-[19px]">remove</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom Marker Styling for Leaflet DOM elements */
.custom-fleet-marker {
  background: transparent;
  border: none;
}
.geofence-tooltip {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
}
</style>

