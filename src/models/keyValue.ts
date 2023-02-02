import { KeyValueDTO } from "../dto/keyValueDTO";
import AppModel from "./appModel";

export class KeyValue implements AppModel {
    constructor(
        public key: string,
        public value: string
        ) { }

    static getFromDTO(dto: KeyValueDTO): KeyValue {
        return new KeyValue(dto.key, dto.value)
    }

    toDTO(): KeyValueDTO {
        return {
            key: this.key,
            value: this.value
        }
    }
}