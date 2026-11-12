<script setup>
import { useFleet } from '../composables/useFleet'
import VehicleCard from './VehicleCard.vue'

// Centralized Reactive Fleet Composable
const {
  selectedVehicleId,
  selectedStatusFilter,
  searchQuery,
  expandedVehicleIds,
  statusCounts,
  filteredVehicles,
  selectVehicle,
  toggleExpand,
  setStatusFilter,
} = useFleet()

// Clean Status Filters Schema (Preserving exact visual classes)
const filterChips = [
  { key: 'all', label: 'All', badgeClass: 'text-secondary' },
  { key: 'moving', label: 'Moving', badgeClass: 'text-on-tertiary-container' },
  { key: 'idle', label: 'Idle', badgeClass: 'text-outline' },
  { key: 'stopped', label: 'Stopped', badgeClass: 'text-error' },
]

// Forwarding Actions
const emit = defineEmits(['locate-vehicle', 'playback-vehicle', 'diagnostics-vehicle'])
</script>

<template>
  <!-- SECONDARY FLYOUT SUB-SIDEBAR DRAWER (Enterprise Clean Architecture) -->
  <section
    class="w-80 shrink-0 h-full bg-surface-container-lowest flex flex-col z-20 shadow-md border-r border-gray-100 select-none"
  >
    <!-- 1. Drawer Header: Title + Inline Search Bar + Tune Filter (All in same top bar) -->
    <div
      class="h-11 px-3 flex items-center justify-between gap-2 bg-surface-container-lowest border-b border-gray-100 shrink-0"
    >
      <h2 class="font-headline-md text-[14px] font-bold text-on-surface shrink-0">
        Vehicles
      </h2>

      <!-- Search Bar right inside the top header -->
      <div
        class="flex-1 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-container-low text-on-surface-variant focus-within:bg-surface-container focus-within:ring-1 focus-within:ring-secondary/30 transition-all"
      >
        <span class="material-symbols-outlined text-[15px] text-outline">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="w-full bg-transparent border-none outline-none text-[12px] text-on-surface placeholder:text-outline font-body-sm"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="w-4 h-4 flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
        >
          <span class="material-symbols-outlined text-[13px]">close</span>
        </button>
      </div>

      <button
        class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer shrink-0"
        title="Filter attributes"
      >
        <span class="material-symbols-outlined text-[17px]">tune</span>
      </button>
    </div>

    <!-- 2. Quick Status Filter Segment Chips (Exact Original Design Preserved) -->
    <div
      class="px-space-md py-space-xs flex items-center gap-1 overflow-x-auto bg-surface-container-low/50 shrink-0"
    >
      <button
        v-for="chip in filterChips"
        :key="chip.key"
        @click="setStatusFilter(chip.key)"
        class="px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors whitespace-nowrap cursor-pointer"
        :class="[
          selectedStatusFilter === chip.key
            ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
            : chip.key === 'stopped'
              ? 'text-error hover:bg-surface-container-lowest'
              : 'text-on-surface-variant hover:bg-surface-container-lowest'
        ]"
      >
        {{ chip.label }}
        <span class="font-code-sm ml-0.5 font-bold" :class="chip.badgeClass">
          {{ statusCounts[chip.key] || 0 }}
        </span>
      </button>
    </div>

    <!-- 3. Dynamic Contextual Vehicle Cards List (Modular Reusable Components) -->
    <div class="flex-1 min-h-0 overflow-y-auto px-2.5 py-2 flex flex-col gap-2">
      <VehicleCard
        v-for="v in filteredVehicles"
        :key="v.id"
        :vehicle="v"
        :is-selected="selectedVehicleId === v.id"
        :is-expanded="expandedVehicleIds.has(v.id)"
        @select="selectVehicle"
        @toggle-expand="toggleExpand"
        @locate="(veh) => emit('locate-vehicle', veh)"
        @playback="(veh) => emit('playback-vehicle', veh)"
        @diagnostics="(veh) => emit('diagnostics-vehicle', veh)"
      />

      <!-- Empty state when no search results match -->
      <div
        v-if="filteredVehicles.length === 0"
        class="py-8 text-center flex flex-col items-center justify-center text-outline gap-1.5"
      >
        <span class="material-symbols-outlined text-[28px]">search_off</span>
        <span class="text-[12px] font-medium">No vehicles found</span>
        <button
          @click="searchQuery = ''; setStatusFilter('all')"
          class="text-[11px] text-secondary font-semibold hover:underline mt-1 cursor-pointer"
        >
          Reset filters
        </button>
      </div>
    </div>

    <!-- 4. Fleet Mini Health Ticker at Drawer Bottom -->
    <div
      class="h-9 px-3 bg-surface-container-low/60 border-t border-gray-100 flex items-center justify-between shrink-0 text-[10px] text-outline"
    >
      <span class="flex items-center gap-1">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Live GPS 1 Hz • 99.8% Sync
      </span>
      <span class="font-code-sm text-secondary font-semibold">Auto-refresh 59s</span>
    </div>
  </section>
</template>
