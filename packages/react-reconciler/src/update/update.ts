import type { Update, UpdateAction } from '@plasticine-react/types'

function createUpdate<State>(action: UpdateAction<State>): Update<State> {
  return {
    action,
  }
}

export { createUpdate }
