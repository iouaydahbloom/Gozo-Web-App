export const appConfig = {
    moralisAppId: process?.env.REACT_APP_MORALIS_APPLICATION_ID ?? '',
    moralisServerUrl: process?.env.REACT_APP_MORALIS_SERVER_URL ?? '',
    backendUrl: process?.env.REACT_APP_BACKEND_URL ?? '',
    tokenContract: process?.env.REACT_APP_TOKEN_CONTRACT ?? '',
    web3AuthSecret: process?.env.REACT_APP_WEB3AUTH_SECRET ?? '',
    adminWallet: process?.env.REACT_APP_ADMIN_WALLET ?? '',
    exchangeContract: process?.env.REACT_APP_EXCHANGE_CONTRACT ?? '',
    chainId: process?.env.REACT_APP_CHAIN_ID ?? '',
    chainHex: process?.env.REACT_APP_CHAIN_HEX ?? '',
    nodeRPCUrl: process?.env.REACT_APP_RPC_URL ?? '',
    magicPublicKey: process?.env.REACT_APP_MAGIC_KEY ?? '',
}