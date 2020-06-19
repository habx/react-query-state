# React Query State


### Example
```typescript
  const [filters, _, { isInitialized }] = useQueryState<LotsFilters>('lotsFilters', { // eslint-disable-line
      customClean: customLotsFilters,
    }
  )
```
