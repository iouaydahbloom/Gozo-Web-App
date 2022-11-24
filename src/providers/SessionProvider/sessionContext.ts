import React from 'react';
import { AuthUser } from '../../models/authUser';
import { WaitableContextProp } from '../waitableContextProp';

interface Props extends WaitableContextProp {
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