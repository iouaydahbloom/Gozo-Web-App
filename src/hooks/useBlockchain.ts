import { useMemo } from "react";
import { useMoralis } from "react-moralis";

const useBlockchain = () => {
    const {
        isAuthenticated,
        isAuthenticating,
        authenticate,
        isWeb3Enabled,
        user,
        authError,
        logout,
        Moralis
    } = useMoralis();

    const web3Options: any = useMemo(() => ({
        provider: "web3Auth",
        clientId: process.env.REACT_APP_WEB3AUTH_SECRET ?? '',
        chainId: 0xa869,
        rpcTarget: 'https://api.avax-test.network/ext/bc/C/rpc'
    }), [])

    async function login() {
        return authenticate(web3Options)
    }

    async function enable() {
        return Moralis.enableWeb3(web3Options)
    }

    async function ensureWeb3Enabled() {
        if (!Moralis.isWeb3Enabled()) {
            await enable()
        }
    }

    return {
        isAuthenticated,
        isAuthenticating,
        authenticate: login,
        enableWeb3: enable,
        isWeb3Enabled,
        user,
        authError,
        logout,
        helpers: Moralis,
        ensureWeb3Enabled
    }
}

export default useBlockchain;