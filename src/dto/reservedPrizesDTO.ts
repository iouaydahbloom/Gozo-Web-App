import { PrizeDTO } from "./PrizeDTO";

export interface ReservedPrizesDTO {
    gameToken: string,
    spinId?: string,
    numberOfCollectedPrizes?: number,
    numberOfPrizes?: number,
    prizes: PrizeDTO[]
}
