// 在 Leaflet Popup 中使用 Vue 组件的几种方法

import type { App, Component } from 'vue'
// import PopupComponent from '@/components/PopupContent.vue'

// 方法2：使用 h 函数和 render
import { createApp, h, render } from 'vue'

export function renderVueComponentWithRender<T extends Record<string, unknown>>(
  popup: L.Popup,
  component: Component<T>,
  componentProps: T,
) {
  // 创建容器
  const container = document.createElement('div')

  // 使用 h 函数创建虚拟节点
  const vnode = h(component, componentProps)

  // 渲染到容器
  render(vnode, container)

  // 设置popup内容
  popup.setContent(container)

  // 清理函数
  return () => render(null, container)
}

// 使用 createApp 方法
export function renderVueComponentWithCreateApp<T extends Record<string, unknown>>(
  popup: L.Popup,
  component: Component<T>,
  componentProps: T,
) {
  // 创建容器
  const container = document.createElement('div')
  // 创建 Vue 应用实例
  const app: App<Element> = createApp(component, componentProps)
  // 挂载到容器
  app.mount(container)
  // 设置 popup 内容
  popup.setContent(container)
  // 返回一个清理函数
  return () => app.unmount()
}
