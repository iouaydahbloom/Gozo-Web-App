import React, { useEffect, useState } from "react";
import InternalStorage from "../../helpers/InternalStorage";
import { sessionContext } from "./sessionContext";

const SessionProvider: React.FC = ({ children }) => {

    const [session, setSession] = useState<any>();
    const [isReady, setIsReady] = useState(false);

    function clear() {
        setSession(null);
    }

    async function initSession() {
        return InternalStorage
            .getFromStorage('authSession')
            .then(session => {
                setSession(session);
                setIsReady(true);
            })
    }

    useEffect(() => {
        initSession();
    }, [])

    useEffect(() => {
        if (session) InternalStorage.setInStorage('authSession', session)
        else InternalStorage.removeFromStorage('authSession');
    }, [session])

    return (
        <sessionContext.Provider value={{
            session,
            setSession,
            clear,
            isReady,
            refresh: initSession
        }}>
            {children}
        </sessionContext.Provider>
    )
}

export default SessionProvider;