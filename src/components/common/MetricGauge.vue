<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    required: true,
  },
  unit: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'speed',
  },
  max: {
    type: Number,
    default: 100,
  },
  barColor: {
    type: String,
    default: null,
  },
  color: {
    type: String,
    default: null,
  },
})

const activeColor = computed(() => props.color || props.barColor || '#3b82f6')

const percentage = computed(() => {
  const num = typeof props.value === 'number' ? props.value : parseFloat(props.value) || 0
  return Math.min(100, Math.max(0, (num / props.max) * 100))
})
</script>

<template>
  <div class="p-2.5 rounded-xl bg-surface-container-low flex flex-col justify-between select-none">
    <div class="flex items-center justify-between text-outline">
      <span class="font-label-sm text-[10px] uppercase font-bold tracking-wider">
        {{ title }}
      </span>
      <span class="material-symbols-outlined text-[16px]">{{ icon }}</span>
    </div>

    <div class="flex items-baseline gap-1 mt-1">
      <span class="font-headline-xl text-[26px] font-bold text-on-surface leading-none">
        {{ value }}
      </span>
      <span v-if="unit" class="font-label-sm text-[11px] text-outline font-semibold">
        {{ unit }}
      </span>
    </div>

    <!-- Progress bar -->
    <div class="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-1.5">
      <div
        class="h-full rounded-full transition-all duration-500"
        :style="{
          width: `${percentage}%`,
          backgroundColor: activeColor,
        }"
      ></div>
    </div>
  </div>
</template>

