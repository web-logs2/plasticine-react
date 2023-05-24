import { supportSymbol } from '../helpers'

/** ReactElement 的 $$typeof 的值 */
export const REACT_ELEMENT_TYPE = supportSymbol() ? Symbol.for('react.element') : 0xeac7
