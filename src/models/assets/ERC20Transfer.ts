import { ERC20TransferDTO } from "../../dto/eRC20TransferDTO";

export class ERC20Transfer {
    constructor(public transactionHash: string,
        public address: string,
        public blockTimestamp: string,
        public blockNumber: string,
        public blockHash: string,
        public toAddress: string,
        public fromAddress: string,
        public value: string) { }

    static getFromDTO(dto: ERC20TransferDTO): ERC20Transfer {
        return new ERC20Transfer(
            dto.transaction_hash,
            dto.address,
            dto.block_timestamp,
            dto.block_number,
            dto.block_hash,
            dto.to_address,
            dto.from_address,
            dto.value
        )
    }
}