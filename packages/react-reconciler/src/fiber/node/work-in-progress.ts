import type { ReactElementProps } from '@plasticine-react/types'

import { FiberFlagEnum } from '../flag'
import { FiberNode } from './fiber-node'

/**
 * 创建待更新的工作树
 * @param current 已渲染到视图中的 Fiber 树
 * @param pendingProps 待更新的 props
 */
export function createWorkInProgress(current: FiberNode, pendingProps: ReactElementProps): FiberNode {
  let wip: FiberNode | null = current.alternate

  if (wip === null) {
    // mount - 首次渲染时不存在 alternate
    wip = new FiberNode(current.tag, pendingProps, current.key)
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
