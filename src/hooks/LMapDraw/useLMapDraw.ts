import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-measure-path-xiaoai'
import { shallowRef } from 'vue'

// import type { Language } from '@/i18n'

// import puLeafletDraw from '@/i18n/leaflet-draw/pu'
// import ruLeafletDraw from '@/i18n/leaflet-draw/ru'
// import zhLeafletDraw from '@/i18n/leaflet-draw/zh'
// import { useLocaleStore } from '@/stores/localeStore'

declare global {
  interface Window {
    type: boolean
    radius: number | undefined
  }
}
;(() => {
  // 解决 leaflet-draw 绘制矩形时的报错
  window.type = true
  // 解决编辑圆形时的报错
  window.radius = undefined
})()

export interface LMapDrawOptions {
  onInitLMapDraw?: (map: L.Map) => void
}

const useLMapDraw = (options?: LMapDrawOptions) => {
  const drawControl = shallowRef<L.Control.Draw | null>(null)
  const featureGroup = shallowRef<L.FeatureGroup | null>(null)

  const handleDrawCreated = (e: L.LeafletEvent) => {
    const drawEvent = e as L.DrawEvents.Created

    const type = drawEvent.layerType
    const layer = drawEvent.layer

    console.log('Layer created:', drawEvent.layerType) // 输出创建的图层信息

    switch (type) {
      case 'marker':
        // layer.bindPopup('Marker created!')
        break
      case 'polygon':
        // layer.bindPopup('Polygon created!')
        break
      case 'polyline':
        // layer.bindPopup('Polyline created!')
        break
      case 'rectangle':
        // layer.bindPopup('Rectangle created!')
        break
      case 'circle':
        // layer.bindPopup('Circle created!')
        break
      default:
        break
    }

    // 或者使用类型守卫
    if ('showMeasurements' in layer && featureGroup.value) {
      ;(layer as L.Polyline | L.Polygon | L.Circle).addTo(featureGroup.value).showMeasurements({
        // showArea: true,
        // showOnHover: true,
        // metric: true, // 使用公制单位
      })
    }
  }

  const initLMapDraw = (map: L.Map) => {
    // 在地图准备好后可以进行其他操作
    featureGroup.value = L.featureGroup().addTo(map)

    // 绘制控件
    drawControl.value = new L.Control.Draw({
      edit: {
        featureGroup: featureGroup.value,
        // poly: {
        //   allowIntersection: false,
        // },
      },
      draw: {
        polyline: {
          // 不要使用英里
          // 使用公里
          // metric: true,
          // repeatMode: true, // 允许重复绘制
          showLength: true,
        }, // 绘制线
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          // showArea: true, // Shows area in the tooltip
          showLength: true, // Shows length in the tooltip
        }, // 绘制多边形
        rectangle: {
          showArea: true,
          // metric: true,
        }, // 绘制矩形
        circle: {
          showRadius: true,
          // metric: true,
        }, // 绘制圆
        marker: false, // 绘制标注
        circlemarker: false, // 绘制圆形标注
      },
    })

    // 添加绘制控件到地图
    map.addControl(drawControl.value)

    console.log('drawControl.value', drawControl.value)

    // 监听绘制事件
    map.on(L.Draw.Event.CREATED, handleDrawCreated)

    options?.onInitLMapDraw?.(map)
  }

  return {
    initLMapDraw,
  }
}

export default useLMapDraw
