import type { Update } from './update'

export interface UpdateQueue<State> {
  shared: {
    pending: Update<State> | null
  }
}

/** UpdateQueue 消费完后返回的结果 */
export interface ProcessedUpdateQueueResult<State> {
  memoizedState: State
}
