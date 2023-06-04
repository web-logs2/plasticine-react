import type { HostComponent, HostConfig } from '@plasticine-react/types'

import { FiberFlagEnum, FiberNode, FiberTagEnum } from '../fiber'

export function completeWork(fiberNode: FiberNode, hostConfig: HostConfig): void {
  const { createHostComponent, createHostText } = hostConfig

  const pendingProps = fiberNode.pendingProps
  const currentFiberNode = fiberNode.alternate

  switch (fiberNode.tag) {
    case FiberTagEnum.HostComponent:
      if (currentFiberNode !== null && fiberNode.stateNode) {
        // update
      } else {
        // mount
        // 1. 离屏构建宿主环境 UI 节点
        const hostComponent = createHostComponent(fiberNode.type, pendingProps)

        // 2. 将构建的节点插入到宿主环境 UI 树中
        appendAllChildren(hostComponent, fiberNode, hostConfig)

        // 3. 关联 FiberNode 与宿主环境 UI 的节点
        fiberNode.stateNode = hostComponent
      }

      bubbleProperties(fiberNode)

      break

    case FiberTagEnum.HostText:
      if (currentFiberNode !== null && fiberNode.stateNode) {
        // update
      } else {
        // mount - 文本节点没有子节点，因此无需调用 appendAllChildren
        const hostText = createHostText(pendingProps.textNodeContent)
        fiberNode.stateNode = hostText
      }

      bubbleProperties(fiberNode)

      break

    case FiberTagEnum.HostRoot:
      bubbleProperties(fiberNode)

      break

    default:
      if (__DEV__) {
        console.warn('[completeWork] 未实现的 FiberNode#tag 情况', fiberNode)
      }

      break
  }
}

/**
 * 将 FiberNode 的所有子节点对应的宿主环境节点插入到 hostComponent 中
 *
 * 需要注意：
 *
 * const Foo = () => <h1></h1>
 * const Bar = () => <h2></h2>
 *
 * <Foo>
 *  <Bar />
 *  <h3>hello</h3>
 * </Foo>
 *
 * 实际应处理成：
 *
 * <h1>
 *   <h2></h2>
 *   <h3>hello</h3>
 * </h1>
 *
 * 也就是需要递归找到 FiberNode 中的第一个 HostComponent 或 HostText
 *
 * @param hostComponent 宿主环境的组件节点
 * @param fiberNode wip FiberNode
 */
function appendAllChildren(hostComponent: HostComponent, fiberNode: FiberNode, hostConfig: HostConfig) {
  const { appendInitialChild } = hostConfig

  let node = fiberNode.child

  while (node !== null) {
    // 回到最初的 FiberNode 时停止
    if (node === fiberNode) {
      return
    }

    if (node.tag === FiberTagEnum.HostComponent || node.tag === FiberTagEnum.HostText) {
      // 找到 HostComponent 或 HostText - 插入到宿主环境 UI 中
      appendInitialChild(hostComponent, node.stateNode)
    } else if (node.child !== null) {
      // 否则有子节点就沿着子节点去继续寻找

      // 寻找的过程中同时关联父子 FiberNode 的关系
      node.child.return = node

      // 沿着子节点寻找
      node = node.child

      continue
    }

    // 往兄弟节点找
    if (node.sibling !== null) {
      // 关联兄弟节点和父节点的关系
      node.sibling.return = node.return

      // 没有子节点就沿着兄弟节点去寻找
      node = node.sibling

      continue
    }

    // 没有兄弟节点就回到父节点
    while (node !== null && node.sibling === null) {
      // 再往上会回到最初进来时的 FiberNode
      if (node.return === null || node.return === fiberNode) {
        return
      }

      node = node.return
    }
  }
}

/**
 * 冒泡 fiberNode 的所有子节点的属性
 *
 * 比如 subtreeFlags
 */
function bubbleProperties(fiberNode: FiberNode) {
  let subtreeFlags: FiberFlagEnum = FiberFlagEnum.NoFlags
  let child = fiberNode.child

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags

    // 关联父子节点
    child.return = fiberNode

    // 继续遍历下一个兄弟节点
    child = child.sibling
  }

  fiberNode.subtreeFlags |= subtreeFlags
}
