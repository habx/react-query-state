import { isEmpty, mapValues, pickBy, isNil } from 'lodash'

export const parseUrlString = (filter: any): any => {
  if (filter instanceof Date) {
    return filter.toISOString()
  }
  if (Array.isArray(filter)) {
    if (filter.length === 0) {
      return undefined
    }
    return filter.map(parseUrlString)
  }
  if (typeof filter === 'object') {
    if (isEmpty(filter)) {
      return undefined
    }
    if (filter['0']) {
      return Object.values(filter)
    }
    return parseQueryString(filter)
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
  } catch (e) {
    //
  }
  return filter
}

export const parseQueryString = <FiltersType>(filters: any) => {
  const state = pickBy(mapValues(filters, parseUrlString), (el) => !isNil(el))
  if (isEmpty(state)) {
    return undefined
  }
  return state
}
