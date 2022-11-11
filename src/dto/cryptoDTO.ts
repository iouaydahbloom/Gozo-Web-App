export interface ERC20AssetDTO {
    token_address: string,
    name: string,
    symbol: string,
    decimals: string,
    balance: string,
    logo?: string,
    thumbnail?: string
}

export interface NativeAssetDTO {
    name: string,
    symbol: string,
    decimals: string,
    balance: string,
    logo?: string,
    thumbnail?: string
}