import React, { useEffect, useState } from "react";
import InternalStorage from "../../helpers/InternalStorage";
import { sessionContext } from "./sessionContext";

const SessionProvider: React.FC = ({ children }) => {

    const [session, setSession] = useState<any>();
    const [isSessionReady, setIsSessionReady] = useState(false);

    function clear() {
        setSession(null);
    }

    useEffect(() => {
        InternalStorage
            .getFromStorage('authSession')
            .then(session => {
                setSession(session);
                setIsSessionReady(true);
            })
    }, [])

    useEffect(() => {
        if (session) InternalStorage.setInStorage('authSession', session)
        else InternalStorage.removeFromStorage('authSession');
    }, [session])

    return (
        <sessionContext.Provider value={{ session, setSession, clear, isSessionReady }}>
            {children}
        </sessionContext.Provider>
    )
}

export default SessionProvider;