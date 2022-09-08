import { useMemo } from "react";
import { useMoralis } from "react-moralis";
import { appConfig } from "../constants/appConfig";

const useBlockchain = () => {
    const {
        isAuthenticated,
        isAuthenticating,
        authenticate,
        isWeb3Enabled,
        user,
        authError,
        logout,
        Moralis,
        isInitialized
    } = useMoralis();

    const web3AuthOptions: any = useMemo(() => ({
        provider: "web3Auth",
        clientId: appConfig.web3AuthSecret,
        chainId: 0xa869,
        rpcTarget: 'https://api.avax-test.network/ext/bc/C/rpc',
        appLogo: 'https://gitlab.com/devsportal/gozo-web-app/-/raw/development/public/assets/icon/favicon.png'
    }), [])

    // const getWeb3MagicOptions = useCallback((email: string): any => ({
    //     provider: "magicLink",
    //     email: email,
    //     apiKey: "pk_live_4761E18BF79E0D3E",
    //     network: 'avalanche testnet'
    // }), [])

    async function login() {
        return authenticate(web3AuthOptions)
    }

    async function enable() {
        return Moralis.enableWeb3()
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
        ensureWeb3Enabled,
        isInitialized
    }
}

export default useBlockchain;