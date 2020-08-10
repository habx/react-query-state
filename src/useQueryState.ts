import { get, isEmpty } from 'lodash'
import * as React from 'react'

import cleanQueryState from './cleanQueryState'
import queryStateContext from './queryState.context'
import { UseQueryStateOptions } from './types'
import usePersistUrlFilters from './usePersistUrlFilters'
import useUrlQuery from './useUrlQuery'

const useQueryState = <FiltersType = any>(
  options: UseQueryStateOptions<FiltersType>
) => {
  const initialized = React.useRef<boolean>(false)

  const { state, setState } = React.useContext(queryStateContext)

  if (!state && options.onChange === undefined) {
    throw new Error(
      'Cannot use uncontrolled mode of useQueryState without QueryStateProvider'
    )
  }

  const groupName = options.groupName ?? 'query'

  const handleCleanFilters = React.useCallback(
    (dirtyFilters: any) =>
      cleanQueryState(dirtyFilters, options.customClean) as FiltersType,
    [options.customClean]
  )

  const handleSetUrl = usePersistUrlFilters(groupName, options.url)
  const urlFilters = useUrlQuery(groupName, options.url)
  const cleanedUrlFilters = handleCleanFilters(urlFilters)

  const currentValueRef = React.useRef<FiltersType | undefined>(
    cleanedUrlFilters ?? options.defaultValue
  )
  const localValue = state?.[groupName] ?? options.value
  if (localValue) {
    currentValueRef.current = localValue
  }
  const currentValue = currentValueRef.current

  const handleSetFilter = React.useCallback(
    (
      newFilters: FiltersType = {} as FiltersType,
      filtersOptions?: { save?: boolean }
    ) => {
      if (groupName && get(filtersOptions, 'save', true)) {
        options.persistValue &&
          options.persistValue(groupName, handleCleanFilters(newFilters))
      }
      options.onChange && options.onChange(groupName, newFilters)
      setState &&
        setState((oldState: any) => ({ ...oldState, [groupName]: newFilters }))
    },
    [groupName, options, setState, handleCleanFilters]
  )

  React.useEffect(() => {
    if (
      currentValue &&
      initialized.current &&
      currentValue !== options.defaultValue
    ) {
      handleSetUrl(currentValue)
    }
  }, [currentValue, handleSetUrl, options.defaultValue])

  React.useEffect(() => {
    if (groupName) {
      if (!isEmpty(urlFilters)) {
        handleSetFilter(cleanedUrlFilters, { save: false })
      } else if (options.url?.persistInitial) {
        handleSetUrl(currentValue)
      }
      initialized.current = true
    }
  }, []) // eslint-disable-line

  return [
    currentValue,
    handleSetFilter,
    { isInitialized: initialized.current },
  ] as const
}

export default useQueryState
