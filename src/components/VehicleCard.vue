<script setup>
import { computed } from 'vue'
import { getStatusTheme } from '../config/statusTheme'
import { useFormatters } from '../composables/useFormatters'
import StatusPill from './common/StatusPill.vue'
import carIconUrl from '../assets/cars/car.png'

const props = defineProps({
  vehicle: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'select',
  'toggle-expand',
  'locate',
  'playback',
  'diagnostics',
])

const { formatDriver, formatEnergyMetric } = useFormatters()

// 1. Centralized Status Theme
const theme = computed(() => getStatusTheme(props.vehicle.status))

// 2. Computed formatted driver details
const driverMeta = computed(() => formatDriver(props.vehicle.driver))

// 3. Computed status pill label
const statusPillLabel = computed(() => {
  if (props.vehicle.status === 'moving') {
    return `${props.vehicle.speed || 0} ${props.vehicle.speedUnit || 'MPH'}`
  }
  return theme.value.label.toUpperCase()
})

// 4. Standardized Details Schema for v-for Loop (DRY Pattern)
const detailRows = computed(() => {
  const v = props.vehicle
  const energy = formatEnergyMetric(v)

  return [
    {
      id: 'driver',
      icon: 'person',
      label: driverMeta.value.name,
      isItalic: !driverMeta.value.isAssigned,
      highlightRight: v.eta || '--',
      isAlertRight: v.status === 'stopped' && v.hasAlert,
    },
    {
      id: 'route',
      icon: 'near_me',
      label: v.route || 'No active route',
      isItalic: false,
      highlightRight: energy.text,
      iconRight: energy.icon,
      isAlertRight: energy.isAlert,
    },
    ...(v.geofence
      ? [
          {
            id: 'geofence',
            icon: 'polyline',
            label: `Geofence: ${v.geofence}`,
            isItalic: false,
            highlightRight: null,
            isAlertRight: false,
            isBadgeRow: true,
          },
        ]
      : []),
  ]
})

// Action buttons schema for v-for
const actionButtons = [
  { id: 'locate', label: 'Locate', icon: 'my_location', title: 'Center map on vehicle' },
  { id: 'playback', label: 'Playback', icon: 'history', title: 'Trip Playback history' },
  { id: 'diagnostics', label: 'CAN', icon: 'vital_signs', title: 'Diagnostics & CAN data' },
]

const handleAction = (actionId) => {
  emit(actionId, props.vehicle)
}
</script>

<template>
  <div
    @click="emit('select', vehicle.id)"
    class="p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 select-none"
    :class="isSelected ? theme.cardClass.selected : theme.cardClass.normal"
  >
    <!-- CARD HEADER BAR (Always Visible) -->
    <div class="flex items-center justify-between">
      <!-- Left: Status Indicator Dot + Car Icon + Vehicle ID + Model -->
      <div class="flex items-center gap-1.5 min-w-0 overflow-hidden">
        <span
          class="w-2 h-2 rounded-full shrink-0"
          :class="theme.dotClass"
        ></span>

        <img
          :src="carIconUrl"
          alt="Car"
          class="w-4 h-4 object-contain shrink-0 opacity-80"
        />

        <span class="font-code-sm text-[13px] font-bold text-on-surface truncate">
          {{ vehicle.id }}
        </span>
        <span class="text-gray-300 text-[11px]">•</span>
        <span class="font-label-sm text-[11px] text-on-surface-variant truncate">
          {{ vehicle.model }}
        </span>
      </div>

      <!-- Right: Status Badge / Collapsed Preview + Chevron -->
      <div class="flex items-center gap-1 shrink-0">
        <!-- Expanded Mode: Reusable Status Pill Component -->
        <StatusPill
          v-if="isExpanded"
          :status="vehicle.status"
          :label="statusPillLabel"
          :has-alert="vehicle.hasAlert"
        />

        <!-- Collapsed Mode: Quick Driver Name + Quick Playback Icon -->
        <template v-else>
          <div class="flex items-center gap-1 text-[11px] text-on-surface-variant mr-1">
            <span class="material-symbols-outlined text-[14px] text-outline">person</span>
            <span
              class="font-medium truncate max-w-[75px]"
              :class="driverMeta.isAssigned ? 'text-on-surface' : 'text-outline italic'"
            >
              {{ driverMeta.shortName }}
            </span>
          </div>
          <button
            class="w-6 h-6 flex items-center justify-center rounded hover:bg-black/5 text-on-surface-variant hover:text-secondary transition-colors"
            title="Trip Playback"
            @click.stop="emit('playback', vehicle)"
          >
            <span class="material-symbols-outlined text-[15px]">history</span>
          </button>
        </template>

        <!-- Chevron Expand / Collapse Toggle -->
        <button
          @click.stop="emit('toggle-expand', vehicle.id)"
          class="w-6 h-6 flex items-center justify-center rounded hover:bg-black/10 text-on-surface-variant transition-colors cursor-pointer ml-0.5"
          :title="isExpanded ? 'Collapse Details' : 'Expand Details'"
        >
          <span class="material-symbols-outlined text-[18px]">
            {{ isExpanded ? 'expand_less' : 'expand_more' }}
          </span>
        </button>
      </div>
    </div>

    <!-- COLLAPSED SUMMARY FOOTER (When chevron is closed) -->
    <div
      v-if="!isExpanded"
      class="flex items-center justify-between text-[11px] pt-0.5 border-t border-black/[0.04]"
    >
      <span class="truncate text-outline">{{ vehicle.route }}</span>
      <span
        class="font-code-sm text-[10px] shrink-0 ml-1 font-semibold"
        :class="vehicle.hasAlert ? 'text-error' : 'text-on-surface-variant'"
      >
        {{ statusPillLabel }}
      </span>
    </div>

    <!-- EXPANDED DETAILED VIEW (Dynamic Uniform Rows via v-for) -->
    <div
      v-if="isExpanded"
      class="flex flex-col gap-1.5 pt-1 border-t border-black/[0.06] text-on-surface-variant text-[12px]"
    >
      <!-- Loop through standardized detail rows -->
      <template v-for="row in detailRows" :key="row.id">
        <!-- Geofence Badge Row -->
        <div
          v-if="row.isBadgeRow"
          class="flex items-center gap-1 font-label-sm text-[11px] text-on-surface bg-black/[0.03] px-2 py-1 rounded"
        >
          <span class="material-symbols-outlined text-[13px] text-secondary">{{ row.icon }}</span>
          <span class="truncate">{{ row.label }}</span>
        </div>

        <!-- Standard Metric / Driver / Route Row -->
        <div
          v-else
          class="flex items-center justify-between text-[11px]"
        >
          <span class="flex items-center gap-1 truncate text-outline">
            <span class="material-symbols-outlined text-[14px] text-outline shrink-0">{{ row.icon }}</span>
            <span
              :class="[
                row.isItalic ? 'italic text-outline' : 'text-on-surface font-medium',
                'truncate'
              ]"
            >
              {{ row.label }}
            </span>
          </span>

          <span
            v-if="row.highlightRight"
            class="font-code-sm text-[11px] shrink-0 ml-1 flex items-center gap-1 font-semibold"
            :class="row.isAlertRight ? 'text-error' : 'text-secondary'"
          >
            <span
              v-if="row.iconRight"
              class="material-symbols-outlined text-[12px]"
              >{{ row.iconRight }}</span
            >
            {{ row.highlightRight }}
          </span>
        </div>
      </template>

      <!-- Standardized Action Buttons via v-for -->
      <div class="flex items-center justify-end gap-1 pt-1 mt-0.5">
        <button
          v-for="btn in actionButtons"
          :key="btn.id"
          @click.stop="handleAction(btn.id)"
          class="px-2 py-1 rounded hover:bg-black/5 text-[11px] text-on-surface-variant hover:text-secondary flex items-center gap-1 font-medium transition-colors cursor-pointer"
          :title="btn.title"
        >
          <span class="material-symbols-outlined text-[15px]">{{ btn.icon }}</span>
          {{ btn.label }}
        </button>
      </div>
    </div>
  </div>
</template>
