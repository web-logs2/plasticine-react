import type { ProcessedUpdateQueueResult, Update, UpdateQueue } from '@plasticine-react/types'

function createUpdateQueue<State>(): UpdateQueue<State> {
  return {
    shared: {
      pending: null,
    },
  }
}

function enqueueUpdate<State>(updateQueue: UpdateQueue<State>, update: Update<State>) {
  updateQueue.shared.pending = update
}

/** 消费 UpdateQueue */
function processUpdateQueue<State>(baseState: State, pendingUpdate: Update<State>): ProcessedUpdateQueueResult<State> {
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

export { createUpdateQueue, enqueueUpdate, processUpdateQueue }
