<template>
  <div class="popup-content rounded-lg min-w-[200px]">
    <h3 class="text-lg font-bold text-blue-600 mb-2">{{ title }}</h3>
    <div class="space-y-2">
      <p class="text-sm">
        <ElProgress
          :percentage="Math.round(progress * 100)"
          color="#13ce66"
        ></ElProgress>
      </p>
      <p class="text-sm">
        <span class="font-semibold">位置:</span>
        <span class="text-gray-700">{{ formatCoordinate(lng) }}, {{ formatCoordinate(lat) }}</span>
      </p>
      <div v-if="track.isPaused" class="flex gap-2 mt-3">
        <button
          @click="onPause"
          class="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
        >
          暂停
        </button>
        <button
          @click="onResume"
          class="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
        >
          继续
        </button>
        <button
          @click="onStop"
          class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
        >
          停止
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElProgress } from 'element-plus'
interface Props {
  track: L.TrackPlayer
  title?: string
  progress?: number
  lng?: number
  lat?: number
  trackIndex?: number
}

interface Emits {
  (e: 'pause'): void
  (e: 'resume'): void
  (e: 'stop'): void
}

withDefaults(defineProps<Props>(), {
  title: '轨迹信息',
  progress: 0,
  lng: 0,
  lat: 0,
  trackIndex: 0,
})

const emit = defineEmits<Emits>()

const formatCoordinate = (value: number): string => {
  return value.toFixed(6)
}

const onPause = () => {
  emit('pause')
}

const onResume = () => {
  emit('resume')
}

const onStop = () => {
  emit('stop')
}


</script>

<style scoped>
.popup-content {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
