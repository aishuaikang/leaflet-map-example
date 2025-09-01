import { shallowRef } from 'vue'

const useLmapDrawLength = () => {
  const tempLatlng = shallowRef<L.LatLng | null>(null)

  const tempMarker = shallowRef<L.Marker | null>(null)

  const gapMarkerList = shallowRef<L.Marker[]>([])

  const tempMarkerX = shallowRef<L.Marker | null>(null)
  const tempMarkerY = shallowRef<L.Marker | null>(null)

  const initLMapDrawLength = (map: L.Map) => {
    const handleDrawStart = (e: L.LeafletEvent) => {
      const drawEvent = e as L.DrawEvents.Created
      const type = drawEvent.layerType

      clearLayer()

      // 矩形
      if (type === 'rectangle') handleDrawRectangleEvent(map)

      // 多边形\折线\圆
      if (type === 'polygon' || type === 'polyline' || type === 'circle')
        handleDrawPolylineEvent(map, type)

      const handleDrawStop = () => {
        map.off('mousemove')
        map.off('click')
        map.off('mousedown')
        map.removeEventListener(L.Draw.Event.DRAWSTOP, handleDrawStop)
        clearLayer()
      }

      map.addEventListener(L.Draw.Event.DRAWSTOP, handleDrawStop)
    }
    map.addEventListener(L.Draw.Event.DRAWSTART, handleDrawStart)
  }

  // 处理多边形、折线、圆的绘制事件
  const handleDrawPolylineEvent = (map: L.Map, type: string) => {
    if (type === 'polygon' || type === 'polyline') {
      map.on('click', (e) => {
        tempLatlng.value = e.latlng
        if (tempMarker.value) gapMarkerList.value.push(tempMarker.value)
        tempMarker.value = null

        map.on('mousemove', (e) => {
          if (!tempLatlng.value) return
          tempMarker.value?.remove()
          const point_gap = map.distance(tempLatlng.value, e.latlng)
          const mid_text = L.divIcon({
            html: formatDistance(point_gap, false),
            className: 'tip-text',
            iconSize: [53, 26],
          })

          const mid_lat = (tempLatlng.value.lat + e.latlng.lat) / 2
          const mid_lng = (tempLatlng.value.lng + e.latlng.lng) / 2
          tempMarker.value = L.marker([mid_lat, mid_lng], {
            icon: mid_text,
          }).addTo(map)
        })
      })
    }
    if (type === 'circle') {
      map.on('mousedown', (e) => {
        tempLatlng.value = e.latlng
        if (tempMarker.value) gapMarkerList.value.push(tempMarker.value)
        tempMarker.value = null

        map.on('mousemove', (e) => {
          if (!tempLatlng.value) return
          tempMarker.value?.remove()
          console.log(12313)
          const point_gap = map.distance(tempLatlng.value, e.latlng)
          const mid_text = L.divIcon({
            html: formatDistance(point_gap, false),
            className: 'tip-text',
            iconSize: [53, 26],
          })
          tempMarker.value = L.marker([tempLatlng.value.lat, tempLatlng.value.lng], {
            icon: mid_text,
          }).addTo(map)
        })
      })
    }
  }

  // 处理矩形的绘制事件
  const handleDrawRectangleEvent = (map: L.Map) => {
    map.on('mousedown', (e) => {
      tempLatlng.value = e.latlng
      if (tempMarkerX.value) gapMarkerList.value.push(tempMarkerX.value)
      if (tempMarkerY.value) gapMarkerList.value.push(tempMarkerY.value)
      tempMarkerX.value = null
      tempMarkerY.value = null

      map.on('mousemove', (e) => {
        if (tempLatlng.value) {
          tempMarkerX.value?.remove()
          tempMarkerY.value?.remove()

          const point_gap_x = map.distance(tempLatlng.value, {
            lat: tempLatlng.value.lat,
            lng: e.latlng.lng,
          })
          const mid_text_x = L.divIcon({
            html: formatDistance(point_gap_x, false),
            className: 'tip-text',
            iconSize: [53, 26],
          })
          const point_gap_y = map.distance(tempLatlng.value, {
            lat: e.latlng.lat,
            lng: tempLatlng.value.lng,
          })
          const mid_text_y = L.divIcon({
            html: formatDistance(point_gap_y, false),
            className: 'tip-text',
            iconSize: [53, 26],
          })
          // 经度中点
          const mid_lng = (tempLatlng.value.lng + e.latlng.lng) / 2
          // 纬度中点
          const mid_lat = (tempLatlng.value.lat + e.latlng.lat) / 2
          tempMarkerX.value = L.marker([tempLatlng.value.lat, mid_lng], { icon: mid_text_x }).addTo(
            map,
          )
          tempMarkerY.value = L.marker([mid_lat, tempLatlng.value.lng], { icon: mid_text_y }).addTo(
            map,
          )
        }
      })
    })
  }

  // 清除临时图层
  const clearLayer = () => {
    tempLatlng.value = null

    tempMarker.value?.remove()
    tempMarker.value = null

    gapMarkerList.value.forEach((marker) => marker.remove())
    gapMarkerList.value = []

    tempMarkerX.value?.remove()
    tempMarkerX.value = null
    tempMarkerY.value?.remove()
    tempMarkerY.value = null
  }

  const formatDistance = (distance: number, imperial: boolean) => {
    let unit, feet

    if (imperial) {
      feet = distance / 0.3048
      if (feet > 3000) {
        distance = distance / 1609.344
        unit = 'mi'
      } else {
        distance = feet
        unit = 'ft'
      }
    } else {
      if (distance > 1000) {
        distance = distance / 1000
        unit = 'km'
      } else {
        unit = 'm'
      }
    }

    if (distance < 100) {
      return distance.toFixed(1) + '' + unit
    } else {
      return Math.round(distance) + '' + unit
    }
  }
  return {
    initLMapDrawLength,
  }
}

export default useLmapDrawLength
