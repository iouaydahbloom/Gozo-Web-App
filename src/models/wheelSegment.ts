import AppModel from "./appModel";
import { Prize } from "./prize";

export class WheelSegment implements AppModel {
    constructor(
        public text: string,
        public id: string,
        public description: string,
        public label?: string,
        public image?: string,
        public fillStyle?: string,
        public textFillStyle?: string,
        public colors?: string[]
        ) { }

    static toWheelSegment(prizes: Prize[]): WheelSegment[] {
        return prizes.map(item => (new WheelSegment(item.name, item.id, item.description, item.label, item.icon)))
    }

    toDTO() {}
}