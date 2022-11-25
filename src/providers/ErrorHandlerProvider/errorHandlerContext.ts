import React from 'react';

interface Props {
    globalError?: Error,
    setGlobalError: (error: Error) => any
}

const errorHandlerContext = React.createContext<Props>({
    globalError: undefined,
    setGlobalError: () => null
})

export { errorHandlerContext }