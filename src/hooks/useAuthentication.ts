import {useCallback, useContext, useState} from "react";
import {AuthUserDTO} from "../dto/authUser";
import {AuthUser} from "../models/authUser";
import {cloudFunctionName} from "../constants/cloudFunctionName";
import {sessionContext} from "../providers/SessionProvider/sessionContext";
import useCloud from "./useCloud";
import useMagicAuth from "./useMagicAuth";
import {useQueryClient} from "react-query";

const useAuthentication = () => {

    const {run} = useCloud();
    const {user: magicUser, connect, disconnect} = useMagicAuth();
    const {session, setSession, clear} = useContext(sessionContext);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authError, setAuthError] = useState<string>();
    const queryClient = useQueryClient();

    const login = useCallback(async (email: string) => {
        try {
            setIsAuthenticating(true);
            await initNewSession();
            const magicResult = await handleMagicAuth(email.trim());
            if (magicResult) {
                const userMetadata = (await magicUser?.getMetadata());
                await handleServerAuth(userMetadata?.email!, userMetadata?.publicAddress!, magicResult);
                setAuthError(undefined);
            }
        } catch (error: any) {
            setAuthError(error.message);
        } finally {
            setIsAuthenticating(false);
        }
    }, [])

    const logout = useCallback(async () => {
        clear();
        await run(cloudFunctionName.logout, null, undefined, true)
        return disconnect();
    }, [session])

    async function serverAuthenticate(email: string, ethAddress: string, externalSession: string) {
        return run(
            cloudFunctionName.login,
            {email: email, ethAddress: ethAddress, externalSession: externalSession},
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
        return connectionResult;
    }

    async function handleServerAuth(email: string, ethAddress: string, magicToken: string) {
        const serverAuthResult = await serverAuthenticate(email, ethAddress, magicToken);
        if (serverAuthResult.isSuccess) {
            const userSession = serverAuthResult.data;
            const magicUserMetadata = await magicUser?.getMetadata();
            userSession.walletAddress = magicUserMetadata?.publicAddress ?? '';
            setSession({
                user: userSession
            })
        } else {
            throw new Error(serverAuthResult.message);
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