export type ReactElementType = string
export type ReactElementKey = string
export type ReactElementRef = any

/** 常规的 ReactElement props */
export type ReactElementNormalProps = Record<string, any>

/** 特殊的 ReactElement props - 比如 children */
export type ReactElementSpecialProps = {
  children?: ReactElement | ReactElement[]
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
