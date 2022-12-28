import { CryptoTransferDTO } from "../../dto/cryptoTransferDTO";

export class CryptoTransfer {
    constructor(public transactionHash: string,
        public address: string,
        public blockTimestamp: string,
        public blockNumber: string,
        public blockHash: string,
        public toAddress: string,
        public fromAddress: string,
        public value: string) { }

    static getFromDTO(dto: CryptoTransferDTO): CryptoTransfer {
        return new CryptoTransfer(
            dto.transactionHash,
            dto.address,
            dto.blockTimestamp,
            dto.blockNumber,
            dto.blockHash,
            dto.toAddress,
            dto.fromAddress,
            dto.value
        )
    }
}