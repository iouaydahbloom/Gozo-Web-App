import {useCallback, useContext, useState} from "react";
import {AuthUser} from "../../models/authUser";
import {sessionContext} from "../../providers/SessionProvider/sessionContext";
import useMagicAuth from "../useMagicAuth";

const staticSession = {
    user: new AuthUser(
        '123897sadhgadsasdjkasd78y123ijhdkajasdlkjasdfkkja32',
        [],
        null,
        new Date(),
        'cbadour@addbloom.com',
        '0x0830C388F0Ba63b96693c14789fD3f07264b56f0',
        '1',
        new Date(),
        'cbadour@addbloom.com',
        '0x0830C388F0Ba63b96693c14789fD3f07264b56f0'
    )
}

const useAuthentication = () => {

    const {disconnect} = useMagicAuth();
    const {session, setSession, clear} = useContext(sessionContext);
    const [isAuthenticating] = useState(false);
    const [authError] = useState<string>();

    const login = useCallback(async (email: string) => {
        setSession(staticSession)
    }, [])

    const logout = useCallback(() => {
        clear();
        return disconnect();
    }, [])

    return {
        login,
        logout,
        isAuthenticated: true,
        user: staticSession.user,
        isAuthenticating,
        authError
    }
}

export default useAuthentication;