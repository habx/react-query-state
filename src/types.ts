export interface UseQueryStateOptions<D extends object> {
  /**
   * Default value used in state
   * @default {}
   */
  defaultValue?: D
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
  parseSearch?: (search: string) => D | undefined
}
