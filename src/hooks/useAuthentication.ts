import { useCallback, useContext, useState } from "react";
import { AuthUserDTO } from "../dto/authUser";
import { AuthUser } from "../models/authUser";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { sessionContext } from "../providers/SessionProvider/sessionContext";
import useCloud from "./useCloud";
import useMagicAuth from "./useMagicAuth";

const useAuthentication = () => {

    const { run } = useCloud();
    const { user: magicUser, connect, disconnect } = useMagicAuth();
    const { session, setSession, clear } = useContext(sessionContext);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authError, setAuthError] = useState<string>();

    const login = useCallback(async (email: string) => {
        setIsAuthenticating(true);
        await initNewSession();
        const magicResult = await handleMagicAuth(email);
        if (magicResult) {
            await handleServerAuth(email, magicResult);
        }
    }, [])

    const logout = useCallback(() => {
        clear();
        return disconnect();
    }, [])

    async function serverAuthenticate(email: string, externalSession: string) {
        return run(
            cloudFunctionName.login,
            { email: email, externalSession: externalSession },
            (result: { user: AuthUserDTO }) => AuthUser.getFromDTO(result?.user)
        )
    }

    async function initNewSession() {
        const isLoggedIn = await magicUser?.isLoggedIn();
        if (session || isLoggedIn) {
            await disconnect();
            clear();
        }
    }

    async function handleMagicAuth(email: string) {
        const connectionResult = await connect(email);
        if (connectionResult) {
            return connectionResult
        }
        setAuthError(connectionResult!);
        return null;
    }

    async function handleServerAuth(email: string, magicToken: string) {
        const serverAuthResult = await serverAuthenticate(email, magicToken);
        if (serverAuthResult.isSuccess) {
            const userSession = serverAuthResult.data;
            const magicUserMetadata = await magicUser?.getMetadata();
            userSession.walletAddress = magicUserMetadata?.publicAddress ?? '';

            setSession({
                user: userSession
            })
        } else {
            setAuthError(serverAuthResult.message);
        }
    }

    return {
        login,
        logout,
        isAuthenticated: !!session?.user,
        user: session?.user,
        isAuthenticating,
        authError
    }
}

export default useAuthentication;