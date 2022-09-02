export class ERC20Transfer {
    constructor(public transaction_hash: string,
        public address: string,
        public block_timestamp: string,
        public block_number: string,
        public block_hash: string,
        public to_address: string,
        public from_address: string,
        public value: string) { }
}