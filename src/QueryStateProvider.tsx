import * as React from 'react'

import QueryStateContext from './queryState.context'

const QueryStateProvider: React.FunctionComponent = ({ children }) => {
  const [state, setState] = React.useState({})
  return (
    <QueryStateContext.Provider value={{ state, setState }}>
      {children}
    </QueryStateContext.Provider>
  )
}

export default QueryStateProvider
