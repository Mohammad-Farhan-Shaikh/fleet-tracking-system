// src/composables/useFleet.js - Centralized Reactive Fleet Telematics State (Single Source of Truth)
import { ref, computed } from 'vue'
import { mockVehicles } from '../data/mockVehicles'

// Shared state across all fleet components (Map, FilterPanel, TopHeader, TelematicsDrawer)
const vehicles = ref([...mockVehicles])
const selectedVehicleId = ref('FL-408')
const selectedStatusFilter = ref('all')
const searchQuery = ref('')
const expandedVehicleIds = ref(new Set(['FL-408']))

export function useFleet() {
  // Currently selected vehicle object
  const selectedVehicle = computed(() => {
    return vehicles.value.find((v) => v.id === selectedVehicleId.value) || null
  })

  // Dynamic live status counts computed directly from reactive data
  const statusCounts = computed(() => {
    const list = vehicles.value
    return {
      all: list.length,
      moving: list.filter((v) => v.status === 'moving').length,
      idle: list.filter((v) => v.status === 'idle').length,
      stopped: list.filter((v) => v.status === 'stopped').length,
      offline: list.filter((v) => v.status === 'offline').length,
    }
  })

  // Filtered vehicles based on search input & status chips
  const filteredVehicles = computed(() => {
    const status = selectedStatusFilter.value
    const q = searchQuery.value.trim().toLowerCase()

    return vehicles.value.filter((v) => {
      // Status match
      if (status !== 'all') {
        if (status === 'stopped' && v.status !== 'stopped') return false
        if (status !== 'stopped' && v.status !== status) return false
      }

      // Query match
      if (q) {
        const matchesId = v.id.toLowerCase().includes(q)
        const matchesDriver = v.driver.toLowerCase().includes(q)
        const matchesModel = v.model.toLowerCase().includes(q)
        const matchesRoute = v.route.toLowerCase().includes(q)
        return matchesId || matchesDriver || matchesModel || matchesRoute
      }

      return true
    })
  })

  // Actions
  const selectVehicle = (id) => {
    selectedVehicleId.value = id
  }

  const toggleExpand = (id) => {
    if (expandedVehicleIds.value.has(id)) {
      expandedVehicleIds.value.delete(id)
    } else {
      expandedVehicleIds.value.add(id)
    }
  }

  const setStatusFilter = (status) => {
    selectedStatusFilter.value = status
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  return {
    vehicles,
    selectedVehicleId,
    selectedVehicle,
    selectedStatusFilter,
    searchQuery,
    expandedVehicleIds,
    statusCounts,
    filteredVehicles,
    selectVehicle,
    toggleExpand,
    setStatusFilter,
    setSearchQuery,
  }
}

