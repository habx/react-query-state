export type UseQueryStateOptions<FiltersType extends object> = {
  /**
   * Default value used in state
   * @default {}
   */
  defaultValue?: FiltersType
  /**
   * Persist state in query url
   * @default true
   */
  persist?: boolean
  /**
   * If provided, state is persisted in session storage with the key provided
   */
  cacheKey?: string
  /**
   * Overwrites default parse url function
   * @param url
   */
  parseSearch?: (search: string) => object | undefined
}
