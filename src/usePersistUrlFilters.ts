import * as qs from 'qs'
import * as React from 'react'

export type UrlFiltersParams = {
  shouldUseGetRoot?: boolean
  persist?: boolean
}

const usePersistUrlFilters = (
  groupName: string,
  config: UrlFiltersParams = {}
) => {
  const { shouldUseGetRoot = false, persist = true } = config

  return React.useCallback(
    (filters = {}) => {
      const location = window.location
      const history = window.history

      const params = shouldUseGetRoot
        ? filters
        : { ...qs.parse(location.search.slice(1)), [groupName]: filters }
      const url = `${location.origin}${location.pathname}`
      if (params && Object.values(params).length > 0) {
        if (persist) {
          history.replaceState(
            '',
            '',
            `${url}?${qs.stringify(params, { encode: false })}`
          )
        }
      } else {
        history.replaceState('', '', url)
      }
    },
    [groupName, persist, shouldUseGetRoot]
  )
}

export default usePersistUrlFilters
