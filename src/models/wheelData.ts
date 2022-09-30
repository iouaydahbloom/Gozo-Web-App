import { WheelDataDTO } from "../dto/wheelDataDTO";
import AppModel from "./appModel";

export class WheelData implements AppModel {
    constructor(
        public text: string,
        public id: string
        ) { }

    static getFromDTO(dto: WheelDataDTO[]): WheelData[] {
        return dto.map(item => (new WheelData(item.name, item.objectId)))
    }

    toDTO(): WheelDataDTO {
        return {
            name: this.text,
            objectId: this.id
        }
    }
}