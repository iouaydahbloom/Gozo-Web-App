import { RewardStatusType } from "../types/rewardStatusType";
import { PrizeDTO } from "./PrizeDTO";

export interface RewardDTO {
    _id: string,
    createdAt: string,
    status: RewardStatusType,
    prize: PrizeDTO
} 


