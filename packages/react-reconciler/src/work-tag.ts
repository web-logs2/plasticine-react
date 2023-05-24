/**
 * 工作单元 fiber 节点的种类
 */
export enum WorkTagEnum {
  /**
   * 挂载的宿主节点
   *
   * @example
   *
   * ```tsx
   * // rootEl 就是 HostRoot
   * const rootEl = document.querySelector('#root')
   * ReactDOM.createRoot(rootEl).mount(<App />)
   * ```
   */
  HostRoot = 'HostRoot',

  /**
   * 宿主环境中的元素
   *
   * @example
   *
   * 这里的 div 就是 HostComponent
   *
   * ```html
   * <div>foo</div>
   * ```
   */
  HostComponent = 'HostComponent',

  /**
   * 宿主环境中的文本节点
   *
   * @example
   *
   * 这里的 div 中的 foo 就是 HostText
   *
   * ```html
   * <div>foo</div>
   * ```
   */
  HostText = 'HostText',
}
