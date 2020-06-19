import { get, isEmpty } from 'lodash'
import * as React from 'react'

import cleanQueryState from './cleanQueryState'
import queryStateContext from './queryState.context'
import usePersistUrlFilters from './usePersistUrlFilters'
import useUrlQuery from './useUrlQuery'
import { UrlFiltersParams } from './useUrlQuery'

export type UseQueryStateOptions<FiltersType> = {
  defaultValue?: FiltersType
  customClean?: (filter: any, key?: string | number) => any | void
  url?: UrlFiltersParams
  value?: FiltersType
  onChange?: (groupName: string, value: FiltersType) => void
  persistValue?: (groupName: string, value: FiltersType) => void
  groupName?: string
}

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
  const currentValue =
    state?.[groupName] ?? options.value ?? options.defaultValue

  const handleCleanFilters = React.useCallback(
    (dirtyFilters: any) =>
      cleanQueryState(dirtyFilters, options.customClean) as FiltersType,
    [options.customClean]
  )

  const handleSetUrl = usePersistUrlFilters(groupName, options.url)
  const urlFilters = useUrlQuery(groupName, options.url)

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
    [options.onChange, groupName, handleCleanFilters, options.persistValue]
  )

  React.useEffect(() => {
    if (currentValue && initialized.current) {
      handleSetUrl(currentValue)
    }
  }, [currentValue, handleSetUrl])

  React.useEffect(() => {
    if (groupName) {
      if (!isEmpty(urlFilters)) {
        const cleanedFilters = handleCleanFilters(urlFilters)
        handleSetFilter(cleanedFilters, { save: false })
      } else {
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
