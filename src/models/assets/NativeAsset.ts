import { NativeAssetDTO } from "../../dto/cryptoDTO";
import { CryptoAsset } from "./CryptoAsset";

export class NativeAsset extends CryptoAsset {
    constructor(public name: string,
        public symbol: string,
        public decimals: string,
        public balance: string,
        public logo?: string,
        public thumbnail?: string) {
        super(name, symbol, decimals, balance, logo, thumbnail)
    }

    static fromDto(dto: NativeAssetDTO): NativeAsset {
        return new NativeAsset(
            dto.name,
            dto.symbol,
            dto.decimals,
            dto.balance,
            dto.logo,
            dto.thumbnail
        )
    }
}