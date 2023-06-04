import type { ReactElementChildren, ReactNode } from '@plasticine-react/types'

import { FiberNode, FiberTagEnum, mountChildFibers, reconcileChildFibers } from '../fiber'
import { processUpdateQueue } from '../update'

/**
 * 负责消费传入的工作单元，并返回下一个工作单元供工作循环消费
 */
export function beginWork(fiberNode: FiberNode): FiberNode | null {
  switch (fiberNode.tag) {
    case FiberTagEnum.HostRoot:
      return updateHostRoot(fiberNode)

    case FiberTagEnum.HostComponent:
      return updateHostComponent(fiberNode)

    // HostText 不存在子节点，直接返回 null
    case FiberTagEnum.HostText:
      return null

    default:
      if (__DEV__) {
        console.warn('尚未实现相关处理逻辑的 FiberNode tag', fiberNode)
      }
      return null
  }
}

function updateHostRoot(fiberNode: FiberNode): FiberNode | null {
  const baseState = fiberNode.memoizedState
  const updateQueue = fiberNode.updateQueue
  const pendingUpdate = updateQueue?.shared.pending

  // 消费 hostRootFiber 的 updateQueue
  if (pendingUpdate) {
    // ReactDOM.createRoot(rootEl).render(<App />)
    // HostRoot 的 updateQueue 中的 Update 存放的是 `<App />`，这里消费完后得到的 memoizedState 就是 <App />，正是 rootEl 对应的 hostRootFiber 的下一个子节点
    const { memoizedState } = processUpdateQueue<ReactNode>(baseState, pendingUpdate)

    fiberNode.memoizedState = memoizedState

    const nextChild = fiberNode.memoizedState

    // reconcileChildren 根据 current Fiber Tree 中的相应节点与 nextChildReactElement 进行 diff 得到下一个 FiberNode
    const nextChildFiberNode = reconcileChildren(fiberNode, nextChild)

    // 更新当前工作的 fiberNode.child
    fiberNode.child = nextChildFiberNode

    // 消费完后重置 updateQueue
    fiberNode.updateQueue!.shared.pending = null

    return nextChildFiberNode
  }

  return null
}

function updateHostComponent(fiberNode: FiberNode): FiberNode | null {
  // <div>foo</div> 的 nextChildren 为 'foo'，从 props.children 中获取
  const nextProps = fiberNode.pendingProps
  const nextChild = nextProps.children

  if (nextChild) {
    const nextChildFiberNode = reconcileChildren(fiberNode, nextChild)

    // 更新当前工作的 fiberNode.child
    fiberNode.child = nextChildFiberNode

    return nextChildFiberNode
  }

  return null
}

function reconcileChildren(wipFiberNode: FiberNode, nextChildren: ReactElementChildren): FiberNode | null {
  const currentFiberNode = wipFiberNode.alternate

  if (currentFiberNode === null) {
    // mount
    return mountChildFibers(wipFiberNode, null, nextChildren)
  } else {
    // update
    return reconcileChildFibers(wipFiberNode, currentFiberNode, nextChildren)
  }
}
