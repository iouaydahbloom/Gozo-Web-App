import React from 'react';
import { AuthUser } from '../../models/authUser';

const sessionContext = React.createContext<{
    session: { user: AuthUser } | null,
    setSession: (session: { user: AuthUser }) => void,
    clear: () => void
}>({
    session: null,
    setSession: () => null,
    clear: () => null
})

export { sessionContext }