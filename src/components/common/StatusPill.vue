<script setup>
import { computed } from 'vue'
import { getStatusTheme } from '../../config/statusTheme'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: null,
  },
  hasAlert: {
    type: Boolean,
    default: false,
  },
})

const theme = computed(() => getStatusTheme(props.status))
const displayLabel = computed(() => props.label || theme.value.label)
</script>

<template>
  <span
    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-label-sm text-[10px] font-bold transition-colors select-none"
    :class="theme.pillClass"
  >
    <span
      v-if="hasAlert"
      class="material-symbols-outlined text-[11px]"
      >warning</span
    >
    {{ displayLabel }}
  </span>
</template>

