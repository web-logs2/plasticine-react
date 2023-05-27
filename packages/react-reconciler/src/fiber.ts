import type {
  HostContainer,
  ReactElementKey,
  ReactElementProps,
  ReactElementRef,
  UpdateQueue,
} from '@plasticine-react/types'

import { WorkTagEnum } from './work-tag'
import { FiberFlagEnum } from './fiber-flag'

/** Fiber 树中的普通节点 */
class FiberNode {
  /**
   * FiberNode 的种类，其与 type 不同，type 指的是这个种类对应的宿主环境类型本身
   *
   * 比如 workTag 为 HostComponent 的一个 div 元素，其 type 为 'div'
   */
  public workTag: WorkTagEnum

  /**
   * 宿主环境类型本身
   *
   * 可以是一个标签的类型字符串，如 div
   * 也可以是一个 FunctionComponent 的函数本身
   */
  public type: any

  /** 用于标识每个 FiberNode */
  public key: ReactElementKey | null

  /** 工作单元处于工作中时的 props */
  public pendingProps: ReactElementProps

  /** 工作单元工作完成时的 props */
  public memoizedProps: ReactElementProps | null

  /** 工作单元工作完成时的 state */
  public memoizedState: any

  /** 对 ReactElement 的引用 */
  public ref: ReactElementRef | null

  /** current 树 & workInProgress 树中对应节点彼此之间的引用 */
  public alternate: FiberNode | null

  /**
   * workInProgress 树中节点变成 current 树时所需进行的操作
   *
   * 比如 插入、删除 节点
   */
  public flags: FiberFlagEnum

  /** 关联对应的更新行为抽象 */
  public updateQueue: UpdateQueue<any> | null

  // =========== 用于与其他 FiberNode 关联 ===========

  /** 指向父 FiberNode */
  public return: FiberNode | null

  /** 指向第一个兄弟 FiberNode */
  public sibling: FiberNode | null

  /** 指向第一个子 FiberNode */
  public child: FiberNode | null

  /** 有多个兄弟 FiberNode 时，自己处在第几个 */
  public index: number

  /**
   * 对于 hostRootFiber，其指向 FiberRootNode
   *
   * 对于普通的 FiberNode，其指向对应的宿主环境元素，比如 DOM Element
   */
  public stateNode: FiberRootNode | any | null

  constructor(workTag: WorkTagEnum, pendingProps: ReactElementProps, key: ReactElementKey | null) {
    this.type = null
    this.workTag = workTag
    this.key = key
    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.memoizedState = null
    this.ref = null
    this.alternate = null
    this.flags = FiberFlagEnum.NoFlags
    this.updateQueue = null

    this.return = null
    this.sibling = null
    this.child = null
    this.index = 0
    this.stateNode = null
  }
}

/** Fiber 树的根节点 */
class FiberRootNode {
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

/**
 * 创建待更新的工作树
 * @param current 已渲染到视图中的 Fiber 树
 * @param pendingProps 待更新的 props
 */
function createWorkInProgress(current: FiberNode, pendingProps: ReactElementProps): FiberNode {
  let wip: FiberNode | null = current.alternate

  if (wip === null) {
    // mount - 首次渲染时不存在 alternate
    wip = new FiberNode(current.workTag, pendingProps, current.key)
    wip.stateNode = current.stateNode
    wip.alternate = current
    current.alternate = wip
  } else {
    // update
    wip.pendingProps = pendingProps

    // 清除副作用
    wip.flags = FiberFlagEnum.NoFlags
  }

  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memoizedProps = current.memoizedProps
  wip.memoizedState = current.memoizedState

  return wip as FiberNode
}

export { FiberNode, FiberRootNode, createWorkInProgress }
