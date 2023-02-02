import { ReservedPrizesDTO } from "../dto/reservedPrizesDTO";
import AppModel from "./appModel";
import { Prize } from "./prize";

export class ReservedPrizes implements AppModel {
    constructor(
        public gameToken: string,
        public prizes: Prize[],
        public spinId?: string,
        public numberOfCollectedPrizes?: number,
        public numberOfPrizes?: number
        ) { }

    static getFromDTO(dto: ReservedPrizesDTO): ReservedPrizes {
        return new ReservedPrizes(dto.gameToken, dto.prizes.map(prize => Prize.getFromDTO(prize)), dto.spinId, dto.numberOfCollectedPrizes, dto.numberOfPrizes)
    }

    toDTO() {}
}