import React from 'react';
import { AuthUser } from '../../models/authUser';
import { CommonContextProp } from '../CommonContextProp';

interface Props extends CommonContextProp {
    session: { user: AuthUser } | null,
    setSession: (session: { user: AuthUser }) => void,
    clear: () => void
}

const sessionContext = React.createContext<Props>({
    session: null,
    setSession: () => null,
    clear: () => null,
    isReady: false,
    refresh: () => Promise.resolve()
})

export { sessionContext }