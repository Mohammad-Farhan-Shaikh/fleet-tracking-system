<script setup>
import { ref, computed } from 'vue'
import { navigationSections } from '../config/navigation'

// Props & Emits
const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
  activeMenu: {
    type: String,
    default: 'live-map',
  },
})

const emit = defineEmits(['select-menu'])

// Search state
const searchQuery = ref('')

// Reactive Filtered Navigation Sections
const filteredSections = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return navigationSections
  }

  // Filter sections and items based on search query
  return navigationSections
    .map((section) => {
      const matchingItems = section.items.filter((item) =>
        item.label.toLowerCase().includes(query)
      )
      return {
        ...section,
        items: matchingItems,
      }
    })
    .filter((section) => section.items.length > 0)
})

const handleItemClick = (itemId) => {
  emit('select-menu', itemId)
}
</script>

<template>
  <aside
    :class="[
      'h-full bg-surface-container-lowest flex flex-col justify-start py-space-sm z-30 transition-all duration-300 ease-in-out select-none border-r border-gray-100 shadow-xs',
      isCollapsed ? 'w-16' : 'w-56',
    ]"
  >
    <!-- Top Search Bar inside primary dock -->
    <div class="px-space-xs shrink-0 flex flex-col gap-space-xs">
      <div v-if="!isCollapsed" class="px-space-xs py-space-xs">
        <div
          class="flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant focus-within:bg-surface-container focus-within:ring-1 focus-within:ring-secondary/30 transition-all"
        >
          <span class="material-symbols-outlined text-[16px] text-outline">search</span>
          <input
            v-model="searchQuery"
            class="bg-transparent border-none outline-none font-body-sm text-body-sm text-on-surface w-full placeholder:text-outline"
            placeholder="Search system..."
            type="text"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="text-outline hover:text-on-surface cursor-pointer flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-[14px]">close</span>
          </button>
          <span
            v-else
            class="font-code-sm text-label-sm text-outline px-1 rounded bg-surface-container shrink-0"
          >
            ⌘K
          </span>
        </div>
      </div>
      <div v-else class="flex justify-center py-1">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-outline hover:text-on-surface cursor-pointer"
          title="Search system (⌘K)"
        >
          <span class="material-symbols-outlined text-[18px]">search</span>
        </button>
      </div>
    </div>

    <!-- Scrollable Navigation Menu (Reactive & Data-Driven) -->
    <div class="flex-1 min-h-0 flex flex-col gap-space-xs overflow-y-auto px-space-xs pb-space-sm">
      <template v-for="(section, sIndex) in filteredSections" :key="section.id">
        <!-- Section Divider (between sections, not before the first one) -->
        <div v-if="sIndex > 0" class="border-t border-gray-200 my-1 mx-2"></div>

        <!-- Section Header Label (hidden when collapsed) -->
        <div v-if="!isCollapsed" class="px-space-sm pt-1">
          <span class="font-label-sm text-[10px] tracking-wider text-outline uppercase font-bold">
            {{ section.title }}
          </span>
        </div>

        <!-- Section Menu Items -->
        <div class="flex flex-col gap-0.5">
          <a
            v-for="item in section.items"
            :key="item.id"
            @click.prevent="handleItemClick(item.id)"
            class="flex items-center px-space-sm py-1.5 rounded-lg transition-all cursor-pointer"
            :class="[
              isCollapsed ? 'justify-center' : 'justify-between',
              activeMenu === item.id
                ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
            ]"
            href="#"
            :title="item.label"
          >
            <!-- Left: Icon + Label -->
            <div class="flex items-center gap-space-sm truncate">
              <span
                class="material-symbols-outlined text-[18px] shrink-0"
                :class="activeMenu === item.id ? 'text-secondary' : 'text-on-surface-variant'"
                :style="activeMenu === item.id ? 'font-variation-settings: \'FILL\' 1' : ''"
              >
                {{ item.icon }}
              </span>
              <span v-if="!isCollapsed" class="font-label-md text-label-md truncate">
                {{ item.label }}
              </span>
            </div>

            <!-- Right: Dynamic Badge (Alerts count, Tickets count, etc.) -->
            <template v-if="!isCollapsed && item.badge !== null">
              <span
                v-if="item.badgeType === 'error'"
                class="font-code-sm text-[10px] bg-error text-on-error font-bold px-1.5 py-0.2 rounded-full shrink-0"
              >
                {{ item.badge }}
              </span>
              <span
                v-else
                class="font-code-sm text-[10px] bg-secondary-fixed text-on-secondary-fixed-variant font-semibold px-1.5 py-0.2 rounded-full shrink-0"
              >
                {{ item.badge }}
              </span>
            </template>
          </a>
        </div>
      </template>

      <!-- Empty state when search produces no matching items -->
      <div
        v-if="filteredSections.length === 0"
        class="py-6 text-center text-outline flex flex-col items-center justify-center gap-1"
      >
        <span class="material-symbols-outlined text-[20px]">search_off</span>
        <span class="text-[11px] font-medium">No menu item found</span>
      </div>
    </div>
  </aside>
</template>
