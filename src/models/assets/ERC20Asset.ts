import { ERC20AssetDTO } from "../../dto/cryptoDTO";
import { CryptoAsset } from "./CryptoAsset";

export class ERC20Asset extends CryptoAsset {
    constructor(public tokenAddress: string,
        public name: string,
        public symbol: string,
        public decimals: string,
        public balance: string,
        public logo?: string,
        public thumbnail?: string) {
        super(name, symbol, decimals, balance, logo, thumbnail)
    }

    static fromDto(dto: ERC20AssetDTO): ERC20Asset {
        return new ERC20Asset(
            dto.contractAddress,
            dto.name,
            dto.symbol,
            dto.decimals,
            dto.balance,
            dto.logo,
            dto.thumbnail
        )
    }
}

export class ERC20Metadata {
    constructor(public address: string,
        public name: string,
        public symbol: string,
        public decimals: string,
        public logo?: string,
        public logo_hash?: string,
        public thumbnail?: string,
        public block_number?: string,
        public validated?: string) { }
}