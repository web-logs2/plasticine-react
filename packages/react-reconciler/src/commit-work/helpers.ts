import { HostComponent, HostContainer } from '@plasticine-react/types'

import { FiberNode, FiberTagEnum } from '../fiber'

/**
 * 找到 FiberNode 在宿主环境中的父节点 - 即向上遍历找到最近的 HostComponent 或 HostRoot 节点
 */
export function getHostParent(fiberNode: FiberNode): HostContainer | HostComponent {
  let parent = fiberNode.return

  while (parent !== null) {
    const tag = parent.tag

    if (tag === FiberTagEnum.HostComponent) {
      return parent.stateNode
    } else if (tag === FiberTagEnum.HostRoot) {
    } else {
      parent = parent.return
    }
  }

  if (__DEV__) {
    console.warn('getHostParent 未找到 FiberNode 对应的宿主环境父节点')
  }
}
