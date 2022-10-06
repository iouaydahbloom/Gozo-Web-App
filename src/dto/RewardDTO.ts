import { PrizeDTO } from "./PrizeDTO";

export interface RewardDTO {
    objectId: string,
    createdAt: string,
    prize: PrizeDTO
}