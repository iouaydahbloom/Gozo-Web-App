import { useCallback, useContext, useState } from "react";
import { AuthUser } from "../../models/authUser";
import { sessionContext } from "../../providers/SessionProvider/sessionContext";
import useMagicAuth from "../useMagicAuth";

const useAuthenticationMock = () => {

    const { disconnect } = useMagicAuth();
    const { session, setSession, clear } = useContext(sessionContext);
    const [isAuthenticating] = useState(false);
    const [authError] = useState<string>();

    const login = useCallback(async (email: string) => {
        setSession({
            user: new AuthUser('', [], null, new Date(), email, '', '', new Date(), '', '')
        })
    }, [])

    const logout = useCallback(() => {
        clear();
        return disconnect();
    }, [])

    return {
        login,
        logout,
        isAuthenticated: !!session?.user,
        user: session?.user,
        isAuthenticating,
        authError
    }
}

export default useAuthenticationMock;