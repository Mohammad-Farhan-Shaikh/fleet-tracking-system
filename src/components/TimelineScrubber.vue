<script setup>
// TimelineScrubber.vue - Exact 1-to-1 copy from reference.html
</script>

<template>
  <!-- 6. BOTTOM TIMELINE REPLAY SCRUBBER (Floating bar anchored above bottom edge) -->
  <footer
    class="absolute bottom-4 left-6 right-6 z-30 pointer-events-auto"
  >
    <div
      class="w-full bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl shadow-xl px-space-md py-space-sm flex flex-col gap-1.5"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-space-sm">
          <button
            class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <span
              class="material-symbols-outlined text-[18px]"
              style="font-variation-settings: 'FILL' 1"
              >play_arrow</span
            >
          </button>
          <!-- Replay Speeds -->
          <div
            class="flex items-center bg-surface-container-low p-0.5 rounded-lg"
          >
            <button
              class="px-2 py-0.5 rounded font-code-sm text-[11px] font-bold bg-surface-container-lowest text-on-surface shadow-xs"
            >
              1x
            </button>
            <button
              class="px-2 py-0.5 rounded font-code-sm text-[11px] text-outline hover:text-on-surface"
            >
              2x
            </button>
            <button
              class="px-2 py-0.5 rounded font-code-sm text-[11px] text-outline hover:text-on-surface"
            >
              5x
            </button>
          </div>
          <!-- Timestamp -->
          <div
            class="flex items-center gap-1.5 font-code-sm text-code-sm text-on-surface"
          >
            <span
              class="material-symbols-outlined text-[16px] text-outline"
              >schedule</span
            >
            <span class="font-bold">13:42:10 CST</span>
            <span class="text-outline text-[11px]"
              >(Live Playback Window)</span
            >
          </div>
        </div>
        <!-- Geofence Trigger markers indicator -->
        <div
          class="flex items-center gap-space-md font-label-sm text-[11px]"
        >
          <span class="flex items-center gap-1 text-on-surface">
            <span class="w-2 h-2 rounded-full bg-secondary"></span>
            11:20 Depot Alpha Entry
          </span>
          <span class="flex items-center gap-1 text-on-surface">
            <span
              class="w-2 h-2 rounded-full bg-tertiary-fixed-dim"
            ></span>
            12:45 I-65 Toll Pass
          </span>
          <span
            class="flex items-center gap-1 text-error font-semibold"
          >
            <span class="w-2 h-2 rounded-full bg-error"></span>
            13:30 Speed Warning (68 MPH)
          </span>
        </div>
      </div>
      <!-- Range scrubber track with timeline notches -->
      <div class="relative w-full flex items-center py-1">
        <div
          class="w-full h-2 bg-surface-container rounded-full relative overflow-hidden cursor-pointer"
        >
          <!-- Active buffered range -->
          <div
            class="absolute left-0 top-0 bottom-0 bg-surface-container-high"
            style="width: 85%"
          ></div>
          <!-- Active played range -->
          <div
            class="absolute left-0 top-0 bottom-0 bg-secondary"
            style="width: 68%"
          ></div>
        </div>
        <!-- Scrubber thumb -->
        <div
          class="absolute w-4 h-4 rounded-full bg-surface-container-lowest shadow-md border-2 border-secondary cursor-grab"
          style="left: 68%"
        ></div>
      </div>
      <!-- Bottom Time Axis Labels -->
      <div
        class="flex items-center justify-between font-code-sm text-[10px] text-outline px-1"
      >
        <span class="">08:00 AM (Trip Origin)</span>
        <span class="">10:00 AM</span>
        <span class="">12:00 PM</span>
        <span class="text-secondary font-bold"
          >13:42 PM (CURRENT)</span
        >
        <span class="">15:00 PM (Est Arrival)</span>
      </div>
    </div>
  </footer>
</template>
