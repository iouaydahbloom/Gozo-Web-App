import { BrandDTO } from "../dto/brandDTO";
import AppModel from "./appModel";


export class Brand implements AppModel {
    constructor(
        public key: string,
        public name: string,
        public logo: string,
        public color: string
        ) { }

    static getFromDTO(dto: BrandDTO): Brand {
        return new Brand(dto.attributes.key, dto.attributes.name, dto.attributes.logo, dto.attributes.color)
    }

    toDTO() { }
}