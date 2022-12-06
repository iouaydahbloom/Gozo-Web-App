import { RewardDTO } from "../dto/RewardDTO";
import AppModel from "./appModel";
import { Prize } from "./prize";


export class Reward implements AppModel {
    constructor(
        public id: string,
        public name: string,
        public date: string,
        public status: string,
        public icon?: string
        ) { }

    static getFromDTO(dto: RewardDTO): Reward {
        const prize = Prize.getFromDTO(dto.prize)
        return new Reward(dto._id, prize.description, dto.createdAt, dto.status, prize.icon)
    }

    toDTO() { }
}