import { renderHook, act } from '@testing-library/react-hooks'
import * as qs from 'qs'

import { useQueryState } from '../src'

describe('use query state', () => {
  describe('act as normal state', () => {
    it('should allow to set state', () => {
      const { result } = renderHook(() => useQueryState<{ value: string }>({}))

      const newState = { value: 'test' }
      act(() => {
        const [_state, setState] = result.current
        setState(newState)
      })
      expect(result.current[0]).toStrictEqual(newState)
    })
    it('should be initialized at first render', () => {
      const defaultValue = { value: 'test' }
      const { result } = renderHook(() =>
        useQueryState<{ value: string }>({ defaultValue })
      )
      expect(result.current[0]).toStrictEqual(defaultValue)
    })
    it('should not change value after a rerender if value has been initialized', () => {
      const defaultValue = { value: 'test' }
      const { result, rerender } = renderHook(() =>
        useQueryState<{ value: string }>({ defaultValue })
      )
      rerender() // init
      const test = result.current
      rerender()
      expect(result.current[0]).toStrictEqual(test[0])
    })
  })
  describe('link with url', () => {
    const defaultValue = { value: 'test' }
    const origin = 'http://localhost'
    const pathname = '/'
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          search: `?${qs.stringify(defaultValue)}`,
          origin,
          pathname,
        },
        writable: true,
      })
    })
    it('should use url value as initial value as first render', () => {
      const { result } = renderHook(() =>
        useQueryState<{ value: string }>({
          defaultValue: { value: 'bad value' },
        })
      )
      expect(result.current[0]?.value).toBe(defaultValue.value)
    })
    it('should change the url according to the state', () => {
      window.history.replaceState = jest.fn()
      const { result } = renderHook(() => useQueryState<{ value: string }>())
      const newValue = { value: 'new value' }
      act(() => {
        const [_state, setState] = result.current
        setState(newValue)
      })
      expect(window.history.replaceState).toBeCalledWith(
        '',
        '',
        `${origin}${pathname}?${qs.stringify(newValue)}`
      )
    })
  })
})
