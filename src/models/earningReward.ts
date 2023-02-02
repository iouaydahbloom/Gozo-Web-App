import { EarningRewardDTO } from "../dto/earningRewardDTO";
import { EarningActionType } from "../types/earningActionType";
import AppModel from "./appModel";


export class EarningReward implements AppModel {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public type: EarningActionType,
        public url: string,
        public logoUrl: string,
        public key: string,
        public zapierActionId: string
        ) { }

    static getFromDTO(dto: EarningRewardDTO): EarningReward {
        return new EarningReward(dto._id, dto.name, dto.description, dto.type , dto.url, dto.logoUrl, dto.key, dto.zapierActionId)
    }

    toDTO() { }
}