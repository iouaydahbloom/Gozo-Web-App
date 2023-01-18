import { BrandDTO } from "../dto/brandDTO";
import AppModel from "./appModel";


export class Brand implements AppModel {
    constructor(
        public key: string,
        public name: string,
        public logo: string,
        public colors: string[]
        ) { }

    static getFromDTO(dto: BrandDTO): Brand {
        return new Brand(dto.brandKey, dto.name, dto.logoUrl, (dto.color && dto.color.length) !== 0 ? dto.color.split(',') : [])
    }

    toDTO() { }
}