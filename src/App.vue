<template>
  <LMap 
      @map-ready="onMapReady"/>
</template>
<script setup lang="ts">
import LMap from '@/components/LMap.vue'
import useLmapDrawLength from './hooks/LMapDraw/useLmapDrawLength';
import useLMapDraw from './hooks/LMapDraw/useLMapDraw';


const { initLMapDrawLength } = useLmapDrawLength()

// 初始化地图绘制功能
const { initLMapDraw } = useLMapDraw({
  onInitLMapDraw: initLMapDrawLength,
}) 

const onMapReady = (map: L.Map) => {
  initLMapDraw(map)
}
</script>

<style scoped></style>
