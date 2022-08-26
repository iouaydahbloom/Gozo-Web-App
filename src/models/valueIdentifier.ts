import { ValueIdentifierDTO } from "../dto/valueIdentifierDTO";
import AppModel from "./appModel";

export class ValueIdentifier implements AppModel {
    constructor(public id: string,
        public value: string) { }

    static getFromDTO(dto: ValueIdentifierDTO): ValueIdentifier {
        return new ValueIdentifier(dto.id, dto.value)
    }

    toDTO(): ValueIdentifierDTO {
        return {
            id: this.id,
            value: this.value
        }
    }
}