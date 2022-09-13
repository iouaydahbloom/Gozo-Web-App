import React, { useEffect, useState } from "react";
import InternalStorage from "../../helpers/InternalStorage";
import { sessionContext } from "./sessionContext";

const SessionProvider: React.FC = ({ children }) => {

    const [session, setSession] = useState<any>();

    function clear() {
        setSession(null);
    }

    useEffect(() => {
        InternalStorage
            .getFromStorage('authSession')
            .then(session => {
                setSession(session);
            })
    }, [])

    useEffect(() => {
        if (session) InternalStorage.setInStorage('authSession', session)
        else InternalStorage.removeFromStorage('authSession')
    }, [session])

    return (
        <sessionContext.Provider value={{ session, setSession, clear }}>
            {children}
        </sessionContext.Provider>
    )
}

export default SessionProvider;