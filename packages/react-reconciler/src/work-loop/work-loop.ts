import type { HostConfig } from '@plasticine-react/types'

import {
  FiberFlagEnum,
  FiberNode,
  FiberRootNode,
  FiberTagEnum,
  MutationMaskFlags,
  createWorkInProgress,
} from '../fiber'
import { beginWork } from './begin-work'
import { completeWork } from './complete-work'

let workInProgress: FiberNode | null = null

/**
 * 为 Fiber 调度更新
 *
 * 从传入的 FiberNode 出发，往上寻找到 FiberRootNode 后调用 renderRoot 开启调度
 */
function scheduleUpdateOnFiber(fiberNode: FiberNode, hostConfig: HostConfig) {
  const root = markUpdateFromFiberToRoot(fiberNode)

  if (root) {
    renderRoot(root, hostConfig)
  }
}

/**
 * 从 fiberNode 出发，往上寻找 FiberRootNode
 */
function markUpdateFromFiberToRoot(fiberNode: FiberNode): FiberRootNode | null {
  let node = fiberNode
  let parent = node.return

  while (parent !== null) {
    node = parent
    parent = node.return
  }

  // hostRootFiber -> 返回其 stateNode 即为 FiberRootNode
  if (node.tag === FiberTagEnum.HostRoot) {
    return node.stateNode as FiberRootNode
  }

  return null
}

function renderRoot(root: FiberRootNode, hostConfig: HostConfig) {
  prepareFreshStack(root)

  do {
    try {
      workLoop(hostConfig)
      break
    } catch (error) {
      if (__DEV__) {
        console.error('workLoop 出错', error)
      }
      workInProgress = null
    }
    // eslint-disable-next-line no-constant-condition
  } while (true)

  const finishedWork = root.current.alternate
  root.finishedWork = finishedWork

  // 进入 commit 阶段
  commitRoot(root)
}

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = createWorkInProgress(root.current, {})
}

/**
 * 核心的工作循环
 *
 * 负责将整颗 workInProgress 树转成 current 树
 *
 * 主要体现在为 workInProgress 树中的节点转变成 current 树中节点的过程中打上所需的 flags
 */
function workLoop(hostConfig: HostConfig) {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress, hostConfig)
  }
}

/** 消费一个工作单元 */
function performUnitOfWork(fiberNode: FiberNode, hostConfig: HostConfig) {
  // 消费当前工作单元，并得到下一个工作单元
  const next = beginWork(fiberNode)

  // 当前工作单元消费完毕后可以更新其 memoizedProps
  fiberNode.memoizedProps = fiberNode.pendingProps

  // 不存在下一个工作单元，说明递归已经无法再深入下去了，对工作单元进行后置操作
  if (next === null) {
    completeUnitOfWork(fiberNode, hostConfig)
  } else {
    workInProgress = next
  }
}

/** 递阶段的任务已结束，开始进入归阶段继续寻找下一个工作单元 */
function completeUnitOfWork(fiberNode: FiberNode, hostConfig: HostConfig) {
  let node: FiberNode | null = fiberNode

  do {
    // 消费归阶段的工作单元
    completeWork(node, hostConfig)

    // 消费完后往其兄弟节点继续前进，使其兄弟节点作为下一个工作单元
    const sibling = node.sibling

    if (sibling !== null) {
      workInProgress = sibling
      return
    }

    // 兄弟节点也不存在了，沿着 return 引用回到父级节点，使其作为下一个工作单元
    node = node.return
    workInProgress = node
  } while (node !== null)
}

function commitRoot(root: FiberRootNode) {
  const finishedWork = root.finishedWork

  if (finishedWork === null) {
    return
  }

  if (__DEV__) {
    console.log('commit 阶段开始', finishedWork)
  }

  const subTreeHasEffect = (finishedWork.subtreeFlags & MutationMaskFlags) !== FiberFlagEnum.NoFlags
  const rootHasEffect = (finishedWork.flags & MutationMaskFlags) !== FiberFlagEnum.NoFlags

  if (subTreeHasEffect || rootHasEffect) {
    // beforeMutation 子阶段
    // mutation 子阶段

    // mutation 子阶段完成后需要进行双缓存树的切换，将内存中处理好的 finishedWork 作为 current 树的根节点
    root.current = finishedWork

    // layout 子阶段
  } else {
    // 没有任何副作用要处理则直接更新双缓存树
    root.current = finishedWork
  }
}

export { scheduleUpdateOnFiber }
