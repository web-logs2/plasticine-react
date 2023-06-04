import type { HostContainer } from '@plasticine-react/types'

import { FiberNode } from './fiber-node'

/** Fiber 树的根节点 */
export class FiberRootNode {
  public container: HostContainer

  /** 指向当前在视图上的 hostRootFiber */
  public current: FiberNode

  /** 指向 render 阶段完成时的 hostRootFiber */
  public finishedWork: FiberNode | null

  constructor(container: HostContainer, hostRootFiber: FiberNode) {
    this.container = container
    this.current = hostRootFiber
    this.finishedWork = null

    hostRootFiber.stateNode = this
  }
}
