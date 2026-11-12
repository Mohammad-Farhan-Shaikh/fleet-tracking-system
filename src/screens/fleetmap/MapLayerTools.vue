<script setup>
import { ref } from 'vue'
import { AVAILABLE_MAP_PROVIDERS } from '../../config/mapConfig'

const props = defineProps({
  activeLayerId: {
    type: String,
    default: 'osm_normal',
  },
  showGeofences: {
    type: Boolean,
    default: true,
  },
  showVehicleLabels: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits([
  'switch-layer',
  'update:showGeofences',
  'update:showVehicleLabels',
])

const isMenuOpen = ref(false)
const hoveredTool = ref(null) // 'maps' | 'tools' | 'measure' | 'traffic'

const handleLayerSelect = (layerId) => {
  emit('switch-layer', layerId)
}
</script>

<template>
  <div class="absolute top-4 right-4 z-20 flex flex-col items-end gap-2 select-none">
    <!-- Main Circular Layers Button -->
    <button
      @click="isMenuOpen = !isMenuOpen"
      class="w-11 h-11 rounded-full bg-white shadow-xl border border-gray-200 flex items-center justify-center text-teal-700 hover:text-teal-800 hover:bg-gray-50 transition-all transform active:scale-95 cursor-pointer relative"
      :class="isMenuOpen ? 'ring-2 ring-teal-600/40 shadow-2xl' : ''"
      title="Map Layers & GIS Tools"
    >
      <span class="material-symbols-outlined text-[24px]">layers</span>
    </button>

    <!-- Expandable Vertical Tool Column (Opens beneath the circle button) -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div
        v-if="isMenuOpen"
        class="flex flex-col gap-1.5 p-1 bg-white rounded-2xl shadow-2xl border border-gray-200"
      >
        <!-- Tool 1: Map Providers & Styles (On hover opens flyout on left) -->
        <div
          class="relative"
          @mouseenter="hoveredTool = 'maps'"
          @mouseleave="hoveredTool = null"
        >
          <button
            class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
            :class="hoveredTool === 'maps' ? 'bg-teal-50 text-teal-700 font-bold' : ''"
            title="Maps & Providers"
          >
            <span class="material-symbols-outlined text-[20px]">map</span>
          </button>

          <!-- Left Hover Flyout: Supported Maps (Leaflet OSM Normal, Hybrid, Google future) -->
          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform translate-x-2 opacity-0"
            enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform translate-x-2 opacity-0"
          >
            <div
              v-if="hoveredTool === 'maps'"
              class="absolute right-12 top-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 flex flex-col gap-2.5 z-30"
            >
              <!-- Flyout Header -->
              <div class="flex items-center justify-between border-b border-gray-100 pb-1.5">
                <span class="font-headline-md text-[13px] font-bold text-gray-900 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-teal-700">map</span>
                  Map Provider
                </span>
                <span class="text-[10px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded-full">
                  Leaflet Active
                </span>
              </div>

              <!-- Leaflet Tile Layers List -->
              <div class="flex flex-col gap-1.5">
                <!-- Normal OSM -->
                <div
                  @click="handleLayerSelect('osm_normal')"
                  class="p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between"
                  :class="
                    activeLayerId === 'osm_normal'
                      ? 'bg-teal-50/90 border-teal-600 ring-1 ring-teal-600/30 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  "
                >
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px] text-teal-700">alt_route</span>
                    <div class="flex flex-col">
                      <span class="text-[12px] font-bold text-gray-800">Normal (OSM)</span>
                      <span class="text-[10px] text-gray-500">Standard street map</span>
                    </div>
                  </div>
                  <span
                    v-if="activeLayerId === 'osm_normal'"
                    class="material-symbols-outlined text-[16px] text-teal-700"
                    >check_circle</span
                  >
                </div>

                <!-- Hybrid Satellite -->
                <div
                  @click="handleLayerSelect('hybrid_satellite')"
                  class="p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between"
                  :class="
                    activeLayerId === 'hybrid_satellite'
                      ? 'bg-teal-50/90 border-teal-600 ring-1 ring-teal-600/30 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  "
                >
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px] text-teal-700">satellite_alt</span>
                    <div class="flex flex-col">
                      <span class="text-[12px] font-bold text-gray-800">Hybrid Satellite</span>
                      <span class="text-[10px] text-gray-500">High-res + road labels</span>
                    </div>
                  </div>
                  <span
                    v-if="activeLayerId === 'hybrid_satellite'"
                    class="material-symbols-outlined text-[16px] text-teal-700"
                    >check_circle</span
                  >
                </div>
              </div>

              <!-- Future Providers Section (Google Maps ready) -->
              <div class="border-t border-gray-100 pt-2 flex flex-col gap-1">
                <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Future Providers
                </span>
                <div
                  v-for="prov in AVAILABLE_MAP_PROVIDERS"
                  :key="prov.id"
                  class="flex items-center justify-between text-[11px] py-1 px-1.5 rounded-lg text-gray-600"
                >
                  <span class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full" :class="prov.active ? 'bg-emerald-500' : 'bg-gray-300'"></span>
                    {{ prov.name }}
                  </span>
                  <span
                    v-if="prov.badge"
                    class="text-[9px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded"
                  >
                    {{ prov.badge }}
                  </span>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Tool 2: GIS Overlays & Tools (Geofence, Traffic) -->
        <div
          class="relative"
          @mouseenter="hoveredTool = 'tools'"
          @mouseleave="hoveredTool = null"
        >
          <button
            class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
            :class="hoveredTool === 'tools' ? 'bg-teal-50 text-teal-700 font-bold' : ''"
            title="GIS Tools & Overlays"
          >
            <span class="material-symbols-outlined text-[20px]">construction</span>
          </button>

          <!-- Left Hover Flyout: GIS Tools & Overlays -->
          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform translate-x-2 opacity-0"
            enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform translate-x-2 opacity-0"
          >
            <div
              v-if="hoveredTool === 'tools'"
              class="absolute right-12 top-0 w-60 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 flex flex-col gap-2 z-30"
            >
              <div class="flex items-center justify-between border-b border-gray-100 pb-1.5">
                <span class="font-headline-md text-[13px] font-bold text-gray-900 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-teal-700">tune</span>
                  GIS Overlays
                </span>
              </div>

              <!-- Geofence Toggle -->
              <label class="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[17px] text-teal-700">polyline</span>
                  <span class="text-[12px] font-medium text-gray-800">Geofence Zones</span>
                </div>
                <input
                  type="checkbox"
                  :checked="showGeofences"
                  @change="$emit('update:showGeofences', $event.target.checked)"
                  class="rounded text-teal-700 focus:ring-teal-600 cursor-pointer w-4 h-4"
                />
              </label>

              <!-- Vehicle Labels Toggle -->
              <label class="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[17px] text-teal-700">label</span>
                  <span class="text-[12px] font-medium text-gray-800">Vehicle ID Badges</span>
                </div>
                <input
                  type="checkbox"
                  :checked="showVehicleLabels"
                  @change="$emit('update:showVehicleLabels', $event.target.checked)"
                  class="rounded text-teal-700 focus:ring-teal-600 cursor-pointer w-4 h-4"
                />
              </label>
            </div>
          </transition>
        </div>

        <!-- Tool 3: Measure / Distance Tool Icon -->
        <div
          class="relative"
          @mouseenter="hoveredTool = 'measure'"
          @mouseleave="hoveredTool = null"
        >
          <button
            class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
            :class="hoveredTool === 'measure' ? 'bg-teal-50 text-teal-700 font-bold' : ''"
            title="Distance & Routing Measure"
          >
            <span class="material-symbols-outlined text-[20px]">straighten</span>
          </button>

          <div
            v-if="hoveredTool === 'measure'"
            class="absolute right-12 top-2 whitespace-nowrap bg-gray-900 text-white text-[11px] font-medium px-2 py-1 rounded shadow-md z-30"
          >
            Route Distance Tool
          </div>
        </div>

        <!-- Tool 4: Traffic / Road Incident Icon -->
        <div
          class="relative"
          @mouseenter="hoveredTool = 'traffic'"
          @mouseleave="hoveredTool = null"
        >
          <button
            class="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
            :class="hoveredTool === 'traffic' ? 'bg-teal-50 text-teal-700 font-bold' : ''"
            title="Traffic Conditions"
          >
            <span class="material-symbols-outlined text-[20px]">traffic</span>
          </button>

          <div
            v-if="hoveredTool === 'traffic'"
            class="absolute right-12 top-2 whitespace-nowrap bg-gray-900 text-white text-[11px] font-medium px-2 py-1 rounded shadow-md z-30"
          >
            Live Traffic Info
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

