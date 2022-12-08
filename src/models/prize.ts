import { PrizeDTO } from "../dto/PrizeDTO";
import AppModel from "./appModel";
import { RewardRequiredData } from "./rewardRequiredField";


export class Prize implements AppModel {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public requiredData?: RewardRequiredData[],
        public icon?: string
        ) { }

    static getFromDTO(dto: PrizeDTO): Prize {
        const requiredData = dto.required_data && dto.required_data.map(data => RewardRequiredData.getFromDTO(data)) 
        return new Prize(dto._id, dto.name, dto.description, requiredData , dto.logoUrl)
    }

    toDTO() { }
}