import { renderHook, act } from '@testing-library/react-hooks'
import * as qs from 'qs'

import { QueryStateProvider, useQueryState } from '../src'

describe('use query state', () => {
  describe('act a normal state', () => {
    it('should allow to set state', () => {
      const { result } = renderHook(
        () => useQueryState<{ value: string }>({}),
        { wrapper: QueryStateProvider }
      )

      const newState = { value: 'test' }
      act(() => {
        const [_state, setState] = result.current
        setState(newState)
      })
      expect(result.current[0]).toBe(newState)
    })
    it('should be initialized after first render', () => {
      const defaultValue = { value: 'test' }
      const { result, rerender } = renderHook(
        () => useQueryState<{ value: string }>({ defaultValue }),
        { wrapper: QueryStateProvider }
      )
      rerender() // init
      expect(result.current[2]?.isInitialized).toBeTruthy()
    })
    it('should not change value after a rerender if value has been initialized', () => {
      const defaultValue = { value: 'test' }
      const { result, rerender } = renderHook(
        () => useQueryState<{ value: string }>({ defaultValue }),
        { wrapper: QueryStateProvider }
      )
      rerender() // init
      const test = result.current
      rerender()
      expect(result.current[0]).toBe(test[0])
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
      const { result } = renderHook(
        () =>
          useQueryState<{ value: string }>({
            url: { shouldUseGetRoot: true },
            defaultValue: { value: 'bad value' },
          }),
        { wrapper: QueryStateProvider }
      )
      expect(result.current[0]?.value).toBe(defaultValue.value)
    })
    it('should change the url according to the state', () => {
      window.history.replaceState = jest.fn()
      const { result } = renderHook(
        () =>
          useQueryState<{ value: string }>({
            url: { shouldUseGetRoot: true },
          }),
        { wrapper: QueryStateProvider }
      )
      const newValue = { value: 'new value' }
      act(() => {
        const [_state, setState] = result.current
        setState(newValue)
      })
      expect(window.history.replaceState).toBeCalledWith(
        '',
        '',
        `${origin}${pathname}?${qs.stringify(newValue, { encode: false })}`
      )
    })
  })
})
