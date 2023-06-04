import type { ReactTextNode } from '@plasticine-react/types'

export function isObject(target: any) {
  return target !== null && typeof target === 'object' && !Array.isArray(target)
}

export function isArray(target: any): target is any[] {
  return Array.isArray(target)
}

export function isReactTextNode(target: any): target is ReactTextNode {
  return typeof target === 'string' || typeof target === 'number'
}
