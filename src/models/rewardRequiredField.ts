import { RewardRequiredDataDTO } from "../dto/rewardRequiredDataDTO";
import AppModel from "./appModel";


export class RewardRequiredData implements AppModel {
    constructor(
        public id: string,
        public name: string,
        public key: string,
        public type: string,
        public value?: any
        ) { }

    static getFromDTO(dto: RewardRequiredDataDTO): RewardRequiredData {
        return new RewardRequiredData(dto._id, dto.name, dto.key, dto.type)
    }

    toDTO() { }
}