import { WheelDataDTO } from "../dto/wheelDataDTO";
import AppModel from "./appModel";

interface StyleType {
    backgroundColor?: string;
    textColor?: string;
  }

export class WheelData implements AppModel {
    constructor(
        public text: string,
        public id: string,
        public style?: StyleType
        ) { }

    static getFromDTO(dto: WheelDataDTO[]): WheelData[] {
        return dto.map(item => (new WheelData(item.name, item.objectId, { backgroundColor: 'green', textColor: 'white' })))
    }

    toDTO(): WheelDataDTO {
        return {
            name: this.text,
            objectId: this.id
        }
    }
}