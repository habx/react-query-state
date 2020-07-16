export type UrlOptions = {
  shouldUseGetRoot?: boolean
  persist?: boolean
  persistInitial?: boolean
}

export type UseQueryStateOptions<FiltersType> = {
  defaultValue?: FiltersType
  customClean?: (filter: any, key?: string | number) => any | void
  url?: UrlOptions
  value?: FiltersType
  onChange?: (groupName: string, value: FiltersType) => void
  persistValue?: (groupName: string, value: FiltersType) => void
  groupName?: string
}
