import type { ReactElement, ReactElementConfig, ReactElementType } from '@plasticine-react/types'

import { resolveJSXParams } from './helpers'
import { createReactElement } from './react-element'

/**
 * jsx 转换的运行时实现
 * @param type ReactElementType - 比如 div, p, h1
 * @param config
 *
 * ReactElementConfig - 用于作为 ReactElementProps 的值
 *
 * 但会对 `key` 和 `ref` 这两个特殊属性进行处理，不赋值到 props 中
 * @param maybeChildren 传入的话则赋值到 props.children 中
 */
export function jsx(type: ReactElementType, config: ReactElementConfig, ...maybeChildren: ReactElement[]) {
  const { key, ref, props } = resolveJSXParams(type, config, ...maybeChildren)

  return createReactElement(type, key, ref, props)
}
