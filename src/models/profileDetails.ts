import { ProfileDetailsDTO } from "../dto/ProfileDetailsDTO";
import AppModel from "./appModel";


export class ProfileDetails implements AppModel {
    constructor(
        public name: string,
        public address: string,
        public email?: string,
        public walletAddress?: string,
        ) { }

    static getFromDTO(dto: ProfileDetailsDTO): ProfileDetails {
        return new ProfileDetails(dto.name, dto.address, dto.email, dto.ethAddress)
    }

    toDTO(): ProfileDetailsDTO { 
        return {
            name: this.name,
            address: this.address
        }
    }
}