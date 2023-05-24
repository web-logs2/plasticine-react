/** 检测当前环境是否支持 symbol */
export function supportSymbol() {
  return typeof Symbol === 'function' && !!Symbol.for
}
