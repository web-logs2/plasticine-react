import type { HostConfig, HostContainer, ReactElement } from '@plasticine-react/types'

import { FiberNode, FiberRootNode } from '../fiber/node'
import { FiberTagEnum } from '../fiber/work-tag'
import { createUpdate, createUpdateQueue, enqueueUpdate } from '../update'
import { scheduleUpdateOnFiber } from '../work-loop'

/** 关联 hostRootFiber 和 root & 为 hostRootFiber 创建 updateQueue */
export function createContainer(container: HostContainer) {
  const hostRootFiber = new FiberNode(FiberTagEnum.HostRoot, {}, null)
  const root = new FiberRootNode(container, hostRootFiber)

  hostRootFiber.updateQueue = createUpdateQueue()

  return root
}

/** 为 element 创建 Update，并关联到 hostRootFiber 的 updateQueue 中 */
export function updateContainer(element: ReactElement | null, root: FiberRootNode, hostConfig: HostConfig) {
  const hostRootFiber = root.current
  const updateQueue = hostRootFiber.updateQueue
  const update = createUpdate(element)

  if (updateQueue) {
    enqueueUpdate(updateQueue, update)
  }

  scheduleUpdateOnFiber(hostRootFiber, hostConfig)

  return element
}
