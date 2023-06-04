import type { ReactNode, ReactTextNode } from './react-node'

export type ReactElementType = string
export type ReactElementKey = string
export type ReactElementRef = any

/** 常规的 ReactElement props */
export type ReactElementNormalProps = Record<string, any>

export type ReactElementChildren = ReactNode | ReactNode[]

/** 特殊的 ReactElement props - 比如 children */
export type ReactElementSpecialProps = {
  children?: ReactElementChildren
  textNodeContent?: ReactTextNode
}
export type ReactElementProps = ReactElementNormalProps & ReactElementSpecialProps

export interface ReactElement {
  $$typeof: symbol | number
  type: ReactElementType
  key: ReactElementKey | null
  ref: ReactElementRef
  props: ReactElementProps
}

export interface ReactElementConfigProps {
  key?: string
  ref?: string
}

/** jsx 函数创建 ReactElement 时的配置参数 */
export type ReactElementConfig = ReactElementProps & ReactElementConfigProps
