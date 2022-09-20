import { WheelDataDTO } from "../dto/wheelDataDTO";
import AppModel from "./appModel";

interface StyleType {
    backgroundColor?: string;
    textColor?: string;
  }

export class WheelData implements AppModel {
    constructor(
        public option: string,
        public style?: StyleType
        ) { }

    static getFromDTO(dto: WheelDataDTO): WheelData {
        return new WheelData(dto.option)
    }

    toDTO(): WheelDataDTO {
        return {
            option: this.option
        }
    }
}