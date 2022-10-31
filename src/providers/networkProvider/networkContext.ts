import React from 'react';

const networkContext = React.createContext<{
    isOnline: boolean
}>({
    isOnline: true
})

export { networkContext }