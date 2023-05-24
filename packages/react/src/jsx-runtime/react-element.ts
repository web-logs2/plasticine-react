import { REACT_ELEMENT_TYPE } from '@plasticine-react/shared'
import type { ReactElement } from '@plasticine-react/types'

export function createReactElement(
  type: ReactElement['type'],
  key: ReactElement['key'],
  ref: ReactElement['ref'],
  props: ReactElement['props'],
): ReactElement {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
  }
}
