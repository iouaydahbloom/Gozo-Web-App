import { RewardDTO } from "../dto/RewardDTO";
import { RewardStatusType } from "../types/rewardStatusType";
import AppModel from "./appModel";
import { Prize } from "./prize";


export class Reward implements AppModel {
    constructor(
        public id: string,
        public name: string,
        public createdAt: string,
        public updatedAt: string,
        public status: RewardStatusType,
        public prizeId: string,
        public icon?: string
        ) { }

    static getFromDTO(dto: RewardDTO): Reward {
        const prize = Prize.getFromDTO(dto.prize)
        return new Reward(dto._id, prize.label ?? prize.description, dto.createdAt, dto.updatedAt, dto.status, prize.id, prize.icon)
    }

    toDTO() { }
}