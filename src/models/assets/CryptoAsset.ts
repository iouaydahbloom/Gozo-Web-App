export class CryptoAsset {
    constructor(public name: string,
        public symbol: string,
        public decimals: string,
        public balance: string,
        public logo?: string,
        public thumbnail?: string) { }
}