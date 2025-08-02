import L from 'leaflet'
import { onMounted, ref, useTemplateRef } from 'vue'

const useLMap = <Keys extends string = string>(key: Keys, onMapReady: (map: L.Map) => void) => {
  const mapRef = useTemplateRef<HTMLElement>(key)
  const mapInstance = ref<L.Map | null>(null)

  onMounted(() => {
    if (!mapRef.value) {
      console.error('Map reference is not defined')
      return
    }
    const map = L.map(mapRef.value, {
      center: [39.909181, 116.397472], // 高德坐标
      // center: [39.907777, 116.391193], // 谷歌坐标
      // center: [51.505, -0.09],
      zoom: 13,
    })

    mapInstance.value = map
    onMapReady(map)
  })

  return {
    mapRef,
    mapInstance,
  }
}

export default useLMap
