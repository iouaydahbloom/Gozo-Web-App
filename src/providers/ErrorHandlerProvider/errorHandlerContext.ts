import React from 'react';

interface Props {
    error?: Error,
    setError: (error: Error) => any
}

const errorHandlerContext = React.createContext<Props>({
    error: undefined,
    setError: () => null
})

export { errorHandlerContext }