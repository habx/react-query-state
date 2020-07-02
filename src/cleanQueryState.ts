import { isEmpty, mapValues, pickBy, isNil, isFunction } from 'lodash'

type CustomCleanState = (filter: any, key?: string | number) => any

export const cleanState = (customCleanState?: CustomCleanState) => (
  filter: any,
  key?: string | number
): any => {
  const customCleanedFilters = isFunction(customCleanState)
    ? customCleanState(filter, key)
    : undefined
  if (customCleanedFilters) {
    return customCleanedFilters
  }
  if (filter instanceof Date) {
    return filter.toISOString()
  }
  if (Array.isArray(filter)) {
    if (filter.length === 0) {
      return undefined
    }
    return filter.map(cleanState(customCleanState))
  }
  if (typeof filter === 'object') {
    if (isEmpty(filter)) {
      return null
    }
    if (filter['0']) {
      return Object.values(filter)
    }
    return cleanQueryState(filter, customCleanState)
  }
  if (filter === 'true') {
    return true
  }
  if (filter === 'false') {
    return false
  }
  try {
    const numberInput = Number(filter.trim())
    if (!isNaN(numberInput)) {
      return Math.round(numberInput)
    }
  } catch (e) {}
  return filter
}

export const cleanQueryState = (
  filters: any,
  customCleanFilter?: CustomCleanState
) => {
  const state = pickBy(
    mapValues(filters, cleanState(customCleanFilter)),
    (el) => !isNil(el)
  )
  if (isEmpty(state)) {
    return null
  }
  return state
}

export default cleanQueryState
