import { isEmpty } from 'lodash'
import * as qs from 'qs'
import * as React from 'react'

import { isClientSide } from './_internal/isClientSide'
import { parseQueryString } from './_internal/parseQueryString'
import { UseQueryStateOptions } from './types'

export const useQueryState = <D extends object = any>(
  options?: UseQueryStateOptions<D>
) => {
  const [state, setState] = React.useState<D | undefined>(() => {
    if (isClientSide) {
      const search = window.location.search.slice(1)
      const parsedQueryString =
        options?.parseSearch?.(search) ?? parseQueryString(qs.parse(search))
      if (parsedQueryString) {
        return parsedQueryString
      }

      if (options?.cacheKey) {
        try {
          const sessionStorage = window.sessionStorage.getItem(options.cacheKey)
          if (!sessionStorage) {
            return options.defaultValue
          }
          return JSON.parse(sessionStorage)
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(
            `Unable to parse query string state stored in session storage: ${e}`
          )
        }
      }

      return options?.defaultValue
    }
  })

  const shouldPersistUrl = options?.persist ?? true

  React.useEffect(() => {
    if (isClientSide) {
      if (shouldPersistUrl) {
        const location = window.location
        const history = window.history
        const url = `${location.origin}${location.pathname}`

        if (!isEmpty(state)) {
          history.replaceState('', '', `${url}?${qs.stringify(state)}`)
        } else {
          history.replaceState('', '', url)
        }
      }

      if (options?.cacheKey) {
        try {
          window.sessionStorage.setItem(options.cacheKey, JSON.stringify(state))
        } catch (e) {
          console.warn(`Unable to stringify query string state: ${e}`) // eslint-disable-line no-console
        }
      }
    }
  }, [options?.cacheKey, shouldPersistUrl, state])

  return [state, setState] as const
}
