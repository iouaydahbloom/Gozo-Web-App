import { PrizeDTO } from "../dto/PrizeDTO";
import AppModel from "./appModel";


export class Prize implements AppModel {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public icon?: string
        ) { }

    static getFromDTO(dto: PrizeDTO): Prize {
        return new Prize(dto._id, dto.name, dto.description, dto.logoUrl)
    }

    toDTO() { }
}