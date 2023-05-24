/** FiberNode 从 workInProgress 树中转到 current 树中时所需进行的操作 */
export enum FiberFlagEnum {
  /** 不需要进行任何操作，可以直接复用整个 FiberNode */
  NoFlags = 0b0000001,

  /** 插入操作 */
  Placement = 0b0000010,

  /** 更新操作 */
  Update = 0b0000100,

  /** 对 child 进行删除操作 */
  ChildDeletion = 0b0001000,
}
