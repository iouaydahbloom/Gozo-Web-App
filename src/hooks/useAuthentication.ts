import {useCallback, useContext, useState} from "react";
import {AuthUserDTO} from "../dto/authUser";
import {AuthUser} from "../models/authUser";
import {cloudFunctionName} from "../constants/cloudFunctionName";
import {sessionContext} from "../providers/SessionProvider/sessionContext";
import useCloud, {CloudResponse} from "./useCloud";
import useMagicAuth from "./useMagicAuth";

/**
 * Custom hook that manages all authentication handlers
 *
 * @returns object
 */
const useAuthentication = () => {

    const {run} = useCloud();
    const {user: magicUser, connect, disconnect} = useMagicAuth();
    const {session, setSession, clear} = useContext(sessionContext);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [authError, setAuthError] = useState<string>();

    /**
     * Login to app
     *
     * @param email - The email of the user
     *
     * @public
     */
    const login = useCallback(async (email: string): Promise<void> => {
        try {
            setIsAuthenticating(true);
            await handleUnusedSessionClearance();
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

    /**
     * Logout from the app
     *
     * @public
     */
    const logout = useCallback(async () => {
        clear();
        await run(cloudFunctionName.logout, null, undefined, true)
        return disconnect();
    }, [session])

    /**
     * Authenticate the User from the server
     *
     * @param email - email of the user
     * @param ethAddress - user's etherium address
     * @param externalSession - user's external Session token (Magic Auth tokens)
     *
     * @private
     */
    async function serverAuthenticate(email: string, ethAddress: string, externalSession: string): Promise<CloudResponse<AuthUser>> {
        return run(
            cloudFunctionName.login,
            {email: email, ethAddress: ethAddress, externalSession: externalSession},
            (result: { user: AuthUserDTO }) => AuthUser.getFromDTO(result?.user)
        )
    }

    /**
     * Handles clearing the actual not used session
     *
     * @private
     */
    async function handleUnusedSessionClearance(): Promise<void> {
        const isLoggedIn = await magicUser?.isLoggedIn();
        if (session || isLoggedIn) {
            await disconnect();
            clear();
        }
    }

    /**
     * Handles Magic Auth authentication
     *
     * @param email - email of the user
     *
     * @returns The Magic Auth connection result
     *
     * @private
     */
    async function handleMagicAuth(email: string): Promise<string | null | undefined> {
        const connectionResult = await connect(email);
        return connectionResult;
    }

    /**
     * Handle server authentication results
     *
     * @param email - email of the user
     * @param ethAddress - user's etherium address
     * @param magicToken - user's Magic Auth generated token
     *
     * @private
     *
     * @throws Error
     * Thrown if the server authentication call returns an error
     */
    async function handleServerAuth(email: string, ethAddress: string, magicToken: string): Promise<void> {
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
        /**
         * login method
         */
        login,
        /**
         * logout method
         */
        logout,
        /**
         * The actual authenticated user
         */
        user: session?.user,
        /**
         * Flag to check if the system is authenticated
         */
        isAuthenticated: !!session?.user,
        /**
         * Flag to check if the authentication process is in progress
         */
        isAuthenticating,
        /**
         * The authentication error
         */
        authError
    }
}

export default useAuthentication;