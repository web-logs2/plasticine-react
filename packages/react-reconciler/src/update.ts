import type { ProcessedUpdateQueueResult, Update, UpdateAction, UpdateQueue } from '@plasticine-react/types'

export function createUpdate<State>(action: UpdateAction<State>): Update<State> {
  return {
    action,
  }
}

export function createUpdateQueue<State>(): UpdateQueue<State> {
  return {
    shared: {
      pending: null,
    },
  }
}

export function enqueueUpdate<State>(updateQueue: UpdateQueue<State>, update: Update<State>) {
  updateQueue.shared.pending = update
}

/** 消费 UpdateQueue */
export function processUpdateQueue<State>(
  baseState: State,
  pendingUpdate: Update<State>,
): ProcessedUpdateQueueResult<State> {
  const result: ProcessedUpdateQueueResult<State> = {
    memoizedState: baseState,
  }

  const action = pendingUpdate.action

  if (action instanceof Function) {
    result.memoizedState = action(baseState)
  } else {
    result.memoizedState = action
  }

  return result
}
