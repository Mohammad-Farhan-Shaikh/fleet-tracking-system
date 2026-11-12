<script setup>
import { computed } from 'vue'
import { getStatusTheme } from '../config/statusTheme'
import { useFormatters } from '../composables/useFormatters'
import StatusPill from './common/StatusPill.vue'
import MetricGauge from './common/MetricGauge.vue'

const props = defineProps({
  vehicle: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'replay-trip', 'view-telemetry', 'call-driver'])
const { getDriverInitials, getEnergyMetrics } = useFormatters()

// Dynamic Diagnostics metrics based on vehicle state
const diagnosticsList = computed(() => {
  if (!props.vehicle) return []
  const v = props.vehicle

  return [
    {
      id: 'coolant',
      label: 'Coolant Temp',
      icon: 'thermostat',
      value: v.status === 'stopped' ? '145°F (Cooling)' : '196°F (Nominal)',
    },
    {
      id: 'oil',
      label: 'Oil Pressure',
      icon: 'compress',
      value: v.hasAlert ? '14 PSI (Low Warning)' : v.status === 'moving' ? '42 PSI (Normal)' : '0 PSI',
      isAlert: v.hasAlert,
    },
    {
      id: 'engine',
      label: 'Engine Speed',
      icon: 'rotate_right',
      value: v.status === 'moving' ? '1,420 RPM' : v.status === 'idle' ? '650 RPM (Idle)' : '0 RPM (Off)',
    },
    {
      id: 'hos',
      label: 'HOS Driving Left',
      icon: 'timelapse',
      value: v.status === 'moving' ? '05h 42m' : '08h 00m (Rest)',
      isHighlight: true,
    },
  ]
})
</script>

<template>
  <!-- 5. FLOATING TELEMATICS INSPECTION CARD (Dynamic Right Side Flyout) -->
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-x-8 opacity-0"
    enter-to-class="transform translate-x-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-x-0 opacity-100"
    leave-to-class="transform translate-x-8 opacity-0"
  >
    <section
      v-if="vehicle"
      class="absolute top-3 right-3 w-88 z-30 pointer-events-auto rounded-2xl bg-white shadow-2xl border border-gray-200/80 p-4 flex flex-col gap-3 select-none"
    >
      <!-- 1. Header row with Vehicle ID, Status pill and Close button -->
      <div class="flex items-start justify-between">
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5">
            <h3 class="font-headline-md text-[17px] text-gray-900 font-bold leading-none">
              {{ vehicle.id }}
            </h3>
            <StatusPill :status="vehicle.status" :has-alert="vehicle.hasAlert" />
          </div>

          <p class="font-body-sm text-[11px] text-gray-500 mt-1">
            {{ vehicle.model }} • {{ vehicle.type || 'Fleet Asset' }}
          </p>
        </div>

        <div class="flex items-center gap-1">
          <span
            class="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-700"
          >
            CANbus 2.0
          </span>
          <button
            @click="emit('close')"
            class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            title="Close Card"
          >
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>

      <!-- 2. Primary Gauge Cluster: Speed & Energy (Fuel / Battery) using DRY MetricGauge -->
      <div class="grid grid-cols-2 gap-2">
        <MetricGauge
          title="Speed"
          :value="vehicle.speed || 0"
          :unit="vehicle.speedUnit || 'MPH'"
          icon="speed"
          :max="75"
          :color="vehicle.speed > 65 ? '#f43f5e' : '#10b981'"
        />

        <MetricGauge
          :title="getEnergyMetrics(vehicle).title"
          :value="getEnergyMetrics(vehicle).value"
          :unit="getEnergyMetrics(vehicle).unit"
          :icon="getEnergyMetrics(vehicle).icon"
          :max="100"
          :color="getEnergyMetrics(vehicle).color"
        />
      </div>

      <!-- 3. Telemetry CANbus Diagnostics Breakdown via Loop -->
      <div class="p-2.5 rounded-xl bg-gray-50 flex flex-col gap-1.5">
        <div
          v-for="diag in diagnosticsList"
          :key="diag.id"
          class="flex items-center justify-between font-body-sm text-[11px]"
        >
          <span class="text-gray-600 flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[14px] text-gray-400">{{ diag.icon }}</span>
            {{ diag.label }}
          </span>
          <span
            class="font-mono font-semibold"
            :class="[
              diag.isAlert ? 'text-red-600 font-bold' : '',
              diag.isHighlight ? 'text-teal-700 font-bold' : 'text-gray-800',
            ]"
          >
            {{ diag.value }}
          </span>
        </div>
      </div>

      <!-- 4. Driver Meta & Contact Call Button -->
      <div class="flex items-center justify-between pt-1 border-t border-gray-100">
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-xs text-teal-800 shrink-0"
          >
            {{ getDriverInitials(vehicle.driver) }}
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-label-md text-[12px] font-semibold text-gray-800 leading-tight truncate">
              {{ vehicle.driver || 'Unassigned' }}
            </span>
            <span class="font-body-sm text-[10px] text-gray-400">
              {{ vehicle.odometer || 'Odo: --' }}
            </span>
          </div>
        </div>

        <button
          @click="emit('call-driver', vehicle)"
          class="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-label-sm text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span class="material-symbols-outlined text-[14px]">call</span>
          Call
        </button>
      </div>

      <!-- 5. Primary Action Trigger Buttons (Replay Trip & Telemetry Report) -->
      <div class="grid grid-cols-2 gap-2 mt-0.5">
        <button
          @click="emit('replay-trip', vehicle)"
          class="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-label-md text-[12px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <span class="material-symbols-outlined text-[16px]">history</span>
          Replay Trip
        </button>

        <button
          @click="emit('view-telemetry', vehicle)"
          class="py-2 px-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-label-md text-[12px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <span class="material-symbols-outlined text-[16px]">bar_chart</span>
          Diagnostics
        </button>
      </div>
    </section>
  </transition>
</template>
