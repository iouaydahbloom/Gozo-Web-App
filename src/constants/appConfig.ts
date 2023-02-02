export const appConfig = {
    serverAppId: process?.env.REACT_APP_SERVER_APP_ID ?? '',
    serverUrl: process?.env.REACT_APP_SERVER_URL ?? '',
    chainId: process?.env.REACT_APP_CHAIN_ID ?? '',
    chainHex: process?.env.REACT_APP_CHAIN_HEX ?? '',
    nodeRPCUrl: process?.env.REACT_APP_RPC_URL ?? '',
    magicPublicKey: process?.env.REACT_APP_MAGIC_KEY ?? '',
    relayAutoTaskUrl: process?.env.REACT_APP_RELAY_AUTO_TASK_WEBHOOK_URL ?? ''
}