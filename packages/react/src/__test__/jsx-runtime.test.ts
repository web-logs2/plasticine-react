import { REACT_ELEMENT_TYPE } from '@plasticine-react/shared'

import { jsx } from '../jsx-runtime/jsx'

describe('jsx-runtime', () => {
  test('should work with props', () => {
    const res = jsx('div', { id: 'foo', className: 'foo' })
    const expectedRes = {
      $$typeof: REACT_ELEMENT_TYPE,
      type: 'div',
      key: null,
      ref: null,
      props: { id: 'foo', className: 'foo' },
    }

    expect(res).toEqual(expectedRes)
  })

  test('should have key in props', () => {
    const res = jsx('div', { id: 'foo', className: 'foo', key: 'foo-key' })
    const expectedRes = {
      $$typeof: REACT_ELEMENT_TYPE,
      type: 'div',
      key: 'foo-key',
      ref: null,
      props: { id: 'foo', className: 'foo' },
    }

    expect(res).toEqual(expectedRes)
  })

  test('should have children in props when children is an array with multiple children', () => {
    const child1 = jsx('div', { id: 'bar', className: 'bar', key: 'bar-key' })
    const child2 = jsx('div', { id: 'baz', className: 'baz', key: 'baz-key' })
    const res = jsx('div', { id: 'foo', className: 'foo', key: 'foo-key' }, child1, child2)
    const expectedRes = {
      $$typeof: REACT_ELEMENT_TYPE,
      type: 'div',
      key: 'foo-key',
      ref: null,
      props: { id: 'foo', className: 'foo', children: [child1, child2] },
    }

    expect(res).toEqual(expectedRes)
  })

  test('should have children in props when children is an array with single child', () => {
    const child1 = jsx('div', { id: 'bar', className: 'bar', key: 'bar-key' })
    const res = jsx('div', { id: 'foo', className: 'foo', key: 'foo-key' }, child1)
    const expectedRes = {
      $$typeof: REACT_ELEMENT_TYPE,
      type: 'div',
      key: 'foo-key',
      ref: null,
      props: { id: 'foo', className: 'foo', children: child1 },
    }

    expect(res).toEqual(expectedRes)
  })
})
