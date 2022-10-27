import { BrandDTO } from "../dto/brandDTO";
import AppModel from "./appModel";


export class Brand implements AppModel {
    constructor(
        public key: string,
        public name: string,
        public logo: string,
        public color1: string,
        public color2: string
        ) { }

    static getFromDTO(dto: BrandDTO): Brand {
        var color1 = ''
        var color2 = '#000'
        if(dto.color) {
            color1 = dto.color
            var color = dto.color.split(',')
            if(color.length === 2) {
                color1 = color[0]
                color2 = color[1]
            }
        }
        return new Brand(dto.key, dto.name, dto.logoUrl, color1, color2)
    }

    toDTO() { }
}