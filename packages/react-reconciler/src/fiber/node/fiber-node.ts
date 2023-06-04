import type {
  ReactElement,
  ReactElementKey,
  ReactElementProps,
  ReactElementRef,
  ReactTextNode,
  UpdateQueue,
} from '@plasticine-react/types'

import { FiberFlagEnum } from '../flag'
import { FiberTagEnum } from '../work-tag'
import { FiberRootNode } from './fiber-root-node'

/** Fiber 树中的普通节点 */
class FiberNode {
  /**
   * FiberNode 的种类，其与 type 不同，type 指的是这个种类对应的宿主环境类型本身
   *
   * 比如 tag 为 HostComponent 的一个 div 元素，其 type 为 'div'
   */
  public tag: FiberTagEnum

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

  /** 以该 FiberNode 为根节点的子树中所包含的所有 flags */
  public subtreeFlags: FiberFlagEnum

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

  constructor(tag: FiberTagEnum, pendingProps: ReactElementProps, key: ReactElementKey | null) {
    this.type = null
    this.tag = tag
    this.key = key
    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.memoizedState = null
    this.ref = null
    this.alternate = null
    this.flags = FiberFlagEnum.NoFlags
    this.subtreeFlags = FiberFlagEnum.NoFlags
    this.updateQueue = null

    this.return = null
    this.sibling = null
    this.child = null
    this.index = 0
    this.stateNode = null
  }
}

/** 为 ReactElement 创建 FiberNode */
function createFiberNodeFromElement(element: ReactElement): FiberNode | null {
  const { key, props, type } = element

  let fiberTag: FiberTagEnum | null = null

  if (typeof type === 'string') {
    fiberTag = FiberTagEnum.HostComponent
  } else {
    if (__DEV__) {
      console.warn(`尚未支持转换 ${type} 类型的 ReactElement 为 FiberNode`, element)
    }
  }

  if (fiberTag !== null) {
    return new FiberNode(fiberTag, props, key)
  }

  return null
}

function createFiberNodeFromTextNode(textNode: ReactTextNode) {
  return new FiberNode(FiberTagEnum.HostText, { textNodeContent: textNode }, null)
}

export { FiberNode, createFiberNodeFromElement, createFiberNodeFromTextNode }
