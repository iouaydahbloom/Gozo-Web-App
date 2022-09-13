import { AuthUserDTO } from "../dto/authUser";
import AppModel from "./appModel";

export class AuthUser implements AppModel {
    constructor(public accessToken: string,
        public accounts: string[],
        public authData: any,
        public createdAt: Date,
        public email: string,
        public ethAddress: string,
        public id: string,
        public updatedAt: Date,
        public username: string,
        public walletAddress: string | null) { }

    static getFromDTO(dto: AuthUserDTO): AuthUser {
        return new AuthUser(dto.accessToken,
            dto.accounts,
            dto.authData,
            new Date(dto.createdAt),
            dto.email,
            dto.ethAddress,
            dto.objectId,
            new Date(dto.updatedAt),
            dto.username,
            null)
    }

    toDTO() { }
}