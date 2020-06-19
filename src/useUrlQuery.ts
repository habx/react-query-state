import * as qs from 'qs'

export type UrlFiltersParams = {
  shouldUseGetRoot?: boolean
  persist?: boolean
}

const useUrlQuery = (groupName: string, config: UrlFiltersParams = {}) => {
  const { shouldUseGetRoot = false } = config

  const search = qs.parse(window.location.search.slice(1))

  return shouldUseGetRoot ? search : search[groupName]
}

export default useUrlQuery
