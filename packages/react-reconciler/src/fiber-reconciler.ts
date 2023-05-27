import type { HostContainer, ReactElement } from '@plasticine-react/types'

import { FiberNode, FiberRootNode } from './fiber'
import { createUpdate, createUpdateQueue, enqueueUpdate } from './update'
import { WorkTagEnum } from './work-tag'
import { scheduleUpdateOnFiber } from './work-loop'

/** 关联 hostRootFiber 和 root & 为 hostRootFiber 创建 updateQueue */
export function createContainer(container: HostContainer) {
  const hostRootFiber = new FiberNode(WorkTagEnum.HostRoot, {}, null)
  const root = new FiberRootNode(container, hostRootFiber)

  hostRootFiber.updateQueue = createUpdateQueue()

  return root
}

/** 为 element 创建 Update，并关联到 hostRootFiber 的 updateQueue 中 */
export function updateContainer(element: ReactElement | null, root: FiberRootNode) {
  const hostRootFiber = root.current
  const updateQueue = hostRootFiber.updateQueue
  const update = createUpdate(element)

  if (updateQueue) {
    enqueueUpdate(updateQueue, update)
  }

  scheduleUpdateOnFiber(hostRootFiber)

  return element
}
