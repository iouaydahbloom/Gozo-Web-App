import { PrizeDTO } from "../dto/PrizeDTO";
import AppModel from "./appModel";

export class WheelSegment implements AppModel {
    constructor(
        public text: string,
        public id: string
        ) { }

    static getFromDTO(dto: PrizeDTO[]): WheelSegment[] {
        return dto.map(item => (new WheelSegment(item.name, item.objectId)))
    }

    toDTO() {}
}