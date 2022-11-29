export class ERC20Transfer {
    constructor(public transactionHash: string,
        public address: string,
        public blockTimestamp: string,
        public blockNumber: string,
        public blockHash: string,
        public toAddress: string,
        public fromAddress: string,
        public value: string) { }
}