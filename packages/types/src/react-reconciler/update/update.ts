/**
 * setState(nextState)
 */
export type UpdateActionPayload<State> = State

/**
 * setState((prevState) => nextState)
 */
export type UpdateActionCallback<State> = (prevState: State) => State

/**
 * 1. setState(nextState)
 * 2. setState((prevState) => nextState)
 */
export type UpdateAction<State> = UpdateActionPayload<State> | UpdateActionCallback<State>

/** 对状态更新行为的抽象 */
export interface Update<State> {
  action: UpdateAction<State>
}
