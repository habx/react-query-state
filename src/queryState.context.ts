import * as React from 'react'

type QueryStateContext = { state: any; setState: (value: any) => void }

export default React.createContext<QueryStateContext>({} as QueryStateContext)
