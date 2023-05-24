import type { ReactElement, ReactElementConfig, ReactElementType } from '@plasticine-react/types'

import { resolveConfig } from './helpers'
import { createReactElement } from './react-element'

/**
 * jsx 转换的运行时实现 - 开发环境下使用，会输出日志信息到控制台
 * @param type ReactElementType - 比如 div, p, h1
 * @param config
 *
 * ReactElementConfig - 用于作为 ReactElementProps 的值
 *
 * 但会对 `key` 和 `ref` 这两个特殊属性进行处理，不赋值到 props 中
 * @param maybeChildren 传入的话则赋值到 props.children 中
 */
export function jsxDEV(type: ReactElementType, config: ReactElementConfig, ...maybeChildren: ReactElement[]) {
  const { key, ref, props } = resolveConfig(config)

  if (key === null) {
    console.warn('创建 ReactElement 时未检测到 `key` 属性')
  }

  return createReactElement(type, key, ref, props)
}
