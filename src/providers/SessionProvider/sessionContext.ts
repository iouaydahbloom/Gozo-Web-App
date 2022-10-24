import React from 'react';
import { AuthUser } from '../../models/authUser';

const sessionContext = React.createContext<{
    session: { user: AuthUser } | null,
    isSessionReady: boolean,
    setSession: (session: { user: AuthUser }) => void,
    clear: () => void
}>({
    session: null,
    isSessionReady: false,
    setSession: () => null,
    clear: () => null
})

export { sessionContext }