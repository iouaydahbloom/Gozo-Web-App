import React from 'react';

const primaryContainerContext = React.createContext<{
    isRefreshing: boolean,
    setIsRefreshing: (isRefreshing: boolean) => void
}>({
    isRefreshing: false,
    setIsRefreshing: () => null
})

export { primaryContainerContext }