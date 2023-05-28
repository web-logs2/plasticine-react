import { FiberNode } from '../fiber'

/**
 * 负责消费传入的工作单元，并返回下一个工作单元供工作循环消费
 */
export function beginWork(fiberNode: FiberNode): FiberNode | null {
  return null
}
