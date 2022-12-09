import { PrizeDTO } from "./PrizeDTO";

export interface ReservedPrizesDTO {
    gameToken: string,
    prizes: PrizeDTO[]
}
