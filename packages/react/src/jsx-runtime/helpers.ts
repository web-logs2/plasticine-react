import type {
  ReactElement,
  ReactElementConfig,
  ReactElementConfigProps,
  ReactElementKey,
  ReactElementProps,
  ReactElementRef,
  ReactElementType,
} from '@plasticine-react/types'

/**
 * 解析 jsx 函数调用时传入的参数
 * @param type ReactElementType - 比如 div, p, h1
 * @param config
 *
 * ReactElementConfig - 用于作为 ReactElementProps 的值
 *
 * 但会对 `key` 和 `ref` 这两个特殊属性进行处理，不赋值到 props 中
 * @param maybeChildren 传入的话则赋值到 props.children 中
 */
export function resolveJSXParams(type: ReactElementType, config: ReactElementConfig, ...maybeChildren: ReactElement[]) {
  let key: ReactElementKey | null = null
  let ref: ReactElementRef | null = null
  const props: ReactElementProps = {}

  for (const [name, value] of Object.entries(config)) {
    // 遇到 `key` 这一特殊的 prop name 时，不对 props 进行赋值
    if ((name as keyof ReactElementConfigProps) === 'key') {
      key = value as ReactElementKey
      continue
    }

    // 遇到 `ref` 这一特殊的 prop name 时，不对 props 进行赋值
    if ((key as keyof ReactElementConfigProps) === 'ref') {
      ref = value as ReactElementRef
      continue
    }

    if (Object.hasOwn(config, name)) {
      props[name] = value
    }
  }

  // 在传入了 children 的情况下将其赋值给 props.children
  // 如果只有一个 child，那么直接将该 child 赋值给 props.children
  const maybeChildrenLength = maybeChildren.length
  if (maybeChildrenLength) {
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0]
    } else {
      props.children = maybeChildren
    }
  }

  return {
    key,
    ref,
    props,
  }
}
