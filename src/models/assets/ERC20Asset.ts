export class ERC20Asset {
    constructor(public token_address: string,
        public name: string,
        public symbol: string,
        public decimals: string,
        public balance: string,
        public logo?: string,
        public thumbnail?: string) { }
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