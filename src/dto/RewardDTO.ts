import { PrizeDTO } from "./PrizeDTO";

export interface RewardDTO {
    _id: string,
    createdAt: string,
    status: string,
    prize: PrizeDTO
} 


