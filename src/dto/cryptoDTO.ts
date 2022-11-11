export interface ERC20AssetDTO extends CryptoAssetDTO {
    token_address: string
}

export interface NativeAssetDTO extends CryptoAssetDTO { }

interface CryptoAssetDTO {
    name: string,
    symbol: string,
    decimals: string,
    balance: string,
    logo?: string,
    thumbnail?: string
}