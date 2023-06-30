import { HostComponent, HostConfig, HostContainer } from '@plasticine-react/types'

import { FiberFlagEnum, FiberNode, FiberTagEnum, MutationMaskFlags } from '../fiber'
import { getHostParent } from './helpers'

let nextEffect: FiberNode | null = null

/**
 * 递归找到子树没有副作用 flags 的 FiberNode 进行渲染
 */
export function commitMutationEffects(finishedWork: FiberNode, hostConfig: HostConfig) {
  nextEffect = finishedWork

  while (nextEffect !== null) {
    const child: FiberNode | null = nextEffect.child

    if ((nextEffect.subtreeFlags & MutationMaskFlags) !== FiberFlagEnum.NoFlags && child !== null) {
      // 子节点存在副作用 flags - 继续往下遍历
      nextEffect = child
    } else {
      // 找到子树无副作用 flags 的节点，对其进行渲染，并继续将其兄弟节点渲染，最后渲染父节点
      up: while (nextEffect !== null) {
        commitMutationEffectsOnFiber(nextEffect, hostConfig)

        const sibling: FiberNode | null = nextEffect.sibling

        if (sibling !== null) {
          // 存在兄弟节点 - 渲染兄弟节点
          nextEffect = sibling
          break up
        }

        // 不存在兄弟节点 - 渲染父节点
        nextEffect = nextEffect.return
      }
    }
  }
}

function commitMutationEffectsOnFiber(fiberNode: FiberNode, hostConfig: HostConfig) {
  const flags = fiberNode.flags

  // Placement 插入节点
  if ((flags & FiberFlagEnum.Placement) !== FiberFlagEnum.NoFlags) {
    commitPlacement(fiberNode, hostConfig)

    // 消费完 flags 后要将其重置
    fiberNode.flags &= ~FiberFlagEnum.Placement
  }
}

/** 消费 Placement flag - 将 FiberNode 对应的宿主环境节点插入到宿主环境父节点中 */
function commitPlacement(fiberNode: FiberNode, hostConfig: HostConfig) {
  if (__DEV__) {
    console.log('commit Placement flag')
  }

  const hostParent = getHostParent(fiberNode)

  appendPlacementNodeIntoContainer(fiberNode, hostParent, hostConfig)
}

/** 将 FiberNode 对应的宿主环境节点插入到其宿主环境父节点中 - 需要将该 FiberNode 宿主环境节点自身及其子节点都插入 */
function appendPlacementNodeIntoContainer(
  fiberNode: FiberNode,
  hostParent: HostContainer | HostComponent,
  hostConfig: HostConfig,
) {
  const tag = fiberNode.tag

  if (tag === FiberTagEnum.HostComponent || tag === FiberTagEnum.HostText) {
    hostConfig.appendChildToContainer(hostParent, fiberNode.stateNode)
    return
  }

  const child = fiberNode.child

  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent, hostConfig)

    let sibling = child.sibling

    while (sibling !== null) {
      appendPlacementNodeIntoContainer(sibling, hostParent, hostConfig)
      sibling = sibling.sibling
    }
  }
}
