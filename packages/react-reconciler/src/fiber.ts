import { ReactElementKey, ReactElementProps, ReactElementRef } from '@plasticine-react/types'

import { WorkTagEnum } from './work-tag'
import { FiberFlagEnum } from './fiber-flag'

export class FiberNode {
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
  public key: ReactElementKey

  /** 工作单元处于工作中时的 props */
  public pendingProps: ReactElementProps

  /** 工作单元工作完成时的 props */
  public memoizedProps: ReactElementProps | null

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

  // =========== 用于与其他 FiberNode 关联 ===========

  /** 指向父 FiberNode */
  public return: FiberNode | null

  /** 指向第一个兄弟 FiberNode */
  public sibling: FiberNode | null

  /** 指向第一个子 FiberNode */
  public child: FiberNode | null

  /** 有多个兄弟 FiberNode 时，自己处在第几个 */
  public index: number

  constructor(workTag: WorkTagEnum, pendingProps: ReactElementProps, key: ReactElementKey) {
    this.type = null
    this.workTag = workTag
    this.key = key
    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.ref = null
    this.alternate = null
    this.flags = FiberFlagEnum.NoFlags

    this.return = null
    this.sibling = null
    this.child = null
    this.index = 0
  }
}
