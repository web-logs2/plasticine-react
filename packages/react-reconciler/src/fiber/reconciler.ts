import { REACT_ELEMENT_TYPE, isArray, isObject, isReactTextNode } from '@plasticine-react/shared'
import type { ReactElement, ReactElementChildren, ReactTextNode } from '@plasticine-react/types'

import { FiberNode, createFiberNodeFromElement } from './node'
import { createFiberNodeFromTextNode } from './node/fiber-node'
import { FiberFlagEnum } from './flag'

/**
 * 对 current FiberNode 和对应的 ReactElement 树中子节点的 ReactElement 之间进行 diff，尽可能对 current FiberNode 进行复用，生成 ReactElement 对应的 FiberNode
 *
 * @param shouldTrackSideEffects 是否要追踪副作用 - 比如为 FiberNode 标记 flags
 */
function createChildReconciler(shouldTrackSideEffects: boolean) {
  /** 调和 ReactElement */
  function reconcileSingleElement(wipFiberNode: FiberNode, currentFiberNode: FiberNode | null, element: ReactElement) {
    const fiberNodeForElement = createFiberNodeFromElement(element)

    if (fiberNodeForElement) {
      fiberNodeForElement.return = wipFiberNode
      return fiberNodeForElement
    }

    return null
  }

  /** 调和 ReactTextNode */
  function reconcileSingleTextNode(
    wipFiberNode: FiberNode,
    currentFiberNode: FiberNode | null,
    textNode: ReactTextNode,
  ) {
    const fiberNodeForTextNode = createFiberNodeFromTextNode(textNode)

    fiberNodeForTextNode.return = wipFiberNode

    return fiberNodeForTextNode
  }

  /** 插入一个 FiberNode - 为其标记 Placement flag */
  function placeSingleChild(fiberNode: FiberNode) {
    // fiberNode 对应的 current FiberNode 为 null 说明是 mount，需要标记 Placement
    const shouldTagPlacement = fiberNode.alternate === null

    if (shouldTrackSideEffects && shouldTagPlacement) {
      fiberNode.flags |= FiberFlagEnum.Placement
    }

    return fiberNode
  }

  return function reconcileChildFibers(
    wipFiberNode: FiberNode,
    currentFiberNode: FiberNode | null,
    nextChildren?: ReactElementChildren,
  ): FiberNode | null {
    // 单节点 - ReactElement
    if (isObject(nextChildren)) {
      let fiberNodeForElement: FiberNode | null = null

      switch ((nextChildren as ReactElement).$$typeof) {
        case REACT_ELEMENT_TYPE:
          fiberNodeForElement = reconcileSingleElement(wipFiberNode, currentFiberNode, nextChildren as ReactElement)
          break

        default:
          if (__DEV__) {
            console.warn('未实现的 reconcile 场景 - ReactElement#$$typeof', nextChildren)
          }
          break
      }

      if (fiberNodeForElement !== null) {
        const placedFiberNode = placeSingleChild(fiberNodeForElement)
        return placedFiberNode
      }

      return null
    }

    // 多节点 - ReactElement[]
    if (isArray(nextChildren)) {
      // TODO
    }

    // 文本节点 - ReactTextNode
    if (isReactTextNode(nextChildren)) {
      const fiberNodeForTextNode = reconcileSingleTextNode(wipFiberNode, currentFiberNode, nextChildren)
      const placedFiberNode = placeSingleChild(fiberNodeForTextNode)

      return placedFiberNode
    }

    if (__DEV__) {
      console.warn('未实现的 reconcile 场景', nextChildren)
    }

    return null
  }
}

/** 用于 mount 时调和子节点，不需要为子节点标记 flags */
const mountChildFibers = createChildReconciler(false)

/** 用于 update 时调和子节点，需要为子节点标记 flags */
const reconcileChildFibers = createChildReconciler(true)

export { mountChildFibers, reconcileChildFibers }
