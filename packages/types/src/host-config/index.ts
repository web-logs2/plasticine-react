export type HostContainer = any

export type HostComponent = any

export type HostText = any

export interface HostConfig<HostComponent = any, HostText = any> {
  /** 创建宿主环境的组件 - 比如 DOM 中的 `<div>`, `<h1>` 等 */
  createHostComponent: (type: string, props: any) => HostComponent

  /** 创建宿主环境的文本节点 */
  createHostText: (text?: string | number) => HostText

  /** 插入元素 */
  appendInitialChild: (parent: HostComponent, child: HostComponent | HostText) => void

  /** 插入元素到容器节点中 */
  appendChildToContainer: (container: HostContainer, child: HostComponent | HostText) => void
}
