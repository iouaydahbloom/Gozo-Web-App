import { DynamicInputIdentifierDTO } from "../dto/dynamicInputIdentifierDTO";
import AppModel from "./appModel";

export class DynamicInputIdentifier implements AppModel {
    constructor(public createdAt: Date,
        public id: number,
        public key: string,
        public value: string) { }

    static getFromDTO(dto: DynamicInputIdentifierDTO): DynamicInputIdentifier {
        return new DynamicInputIdentifier(
            new Date(dto.created_at),
            dto.id,
            dto.key,
            dto.value
        )
    }

    toDTO() { }
}