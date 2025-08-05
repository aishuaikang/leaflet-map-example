<template>
  <div ref="lmap" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import useLMap from '@/hooks/useLMap'
import L from 'leaflet'
import 'leaflet-coord-converter-xiaoai'
import 'leaflet-trackplayer-xiaoai'
import PopupContent from './PopupContent.vue'



import uavIcon from '@/assets/uavIcon.png'
import { renderVueComponentWithCreateApp } from '@/utils/popupHelpers'

defineOptions({
  name: 'LMapComponent',
})

useLMap(
  'lmap',
  {
  },
  (lmap) => {
    // 高德矢量地图
    const gcj02Layer = L.tileLayer(
      'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
    )

    // 高德卫星地图
    const gaodeSatelliteLayer = L.tileLayer(
      'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      {
        minZoom: 3,
      },
    )

    // 离线高德地图
    const offlineLayer = L.tileLayer('/public/tiles/{z}/{x}/{y}.jpg')

    // 谷歌矢量地图
    const googleLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      currentCoordType: 'gcj02',
      coordType: 'gps84',
    })

    // 默认添加高德地图
    gcj02Layer.addTo(lmap)

    // 添加图层控制
    const baseLayers = {
      高德地图: gcj02Layer,
      高德卫星: gaodeSatelliteLayer,
      离线地图: offlineLayer,
      谷歌地图: googleLayer,
    }

    // 添加图层控制器
    L.control.layers(baseLayers).addTo(lmap)
    // 添加指南针控件
    // console.log(lmap.touchRotate.enabled())
    // L.control.rotate({}).addTo(lmap)
    // console.dir(L.control)

    // 自动缩放到轨迹范围
    const bounds = L.latLngBounds(path.map((point) => [point.lat, point.lng]))
    lmap.fitBounds(bounds, { padding: [50, 50] })

    // 创建弹出层
    const popup = L.popup({
      offset: [0, -16],
      closeButton: false,
      autoClose: false,
      closeOnClick: false,
    })
      .setLatLng(path[0])
      .openOn(lmap)

    // 添加轨迹点标记
    const track = new L.TrackPlayer(path, {
      markerIcon: L.icon({
        iconUrl: uavIcon,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      }),
      markerRotation: true,
      notPassedLineColor: '#ccc',
      speed: 800,
      markerRotationOffset: 180,
      // polylineDecoratorOptions: {
      //   patterns: [],
      // },
    }).addTo(lmap)

    console.log(track)

    // 开始播放轨迹
    track.start()

    let a :(()=>void )| null = null

      // window.track = track
    // 监听进度事件
    track.on('progress', (progress, latlng, index) => {
      console.log(
        `progress:${progress} - position:${latlng.lng},${latlng.lat} - trackIndex:${index}`,
      )
      popup.setLatLng(latlng)
      a?.()
      a = renderVueComponentWithCreateApp(
        popup,
        PopupContent,
        {
          track: track,
          title: '轨迹信息',
          progress,
          lng: latlng.lng,
          lat: latlng.lat,
          trackIndex: index,
          onPause: () => track.pause(),
          onResume: () => track.start(),
        },
      )
      // popup.setContent(`
      // <p>进度: ${progress}</p>
      //   <p>位置: ${latlng.lng.toFixed(6)}, ${latlng.lat.toFixed(6)}</p>
      //   <p>轨迹索引: ${index}</p>`)
    })
  },
)

const path = [
  {
    lat: 39.90918,
    lng: 116.397446,
  },
  {
    lat: 39.907956,
    lng: 116.397497,
  },
  {
    lat: 39.908078,
    lng: 116.403268,
  },
  {
    lat: 39.9083,
    lng: 116.418106,
  },
]
</script>

<style scoped></style>
