import { PrizeDTO } from "../dto/PrizeDTO";
import AppModel from "./appModel";

export class WheelSegment implements AppModel {
    constructor(
        public text: string,
        public id: string,
        public description: string,
        public label: string,
        public image?: string,
        public fillStyle?: string,
        public textFillStyle?: string
        ) { }

    static getFromDTO(dto: PrizeDTO[]): WheelSegment[] {
        return dto.map(item => (new WheelSegment(item.name, item.objectId, item.description, item.label, item.logoUrl)))
    }

    toDTO() {}
}