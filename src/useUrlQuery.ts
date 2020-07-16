import * as qs from 'qs'

import { UrlOptions } from './types'

const useUrlQuery = (groupName: string, config: UrlOptions = {}) => {
  const { shouldUseGetRoot = false } = config

  const search = qs.parse(window.location.search.slice(1))

  return shouldUseGetRoot ? search : search[groupName]
}

export default useUrlQuery
