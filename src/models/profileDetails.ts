import { ProfileDetailsDTO, ProfileSocialAccountDTO } from "../dto/ProfileDetailsDTO";
import AppModel from "./appModel";
import { SocialAccountType } from "./socialAccountType";


export class ProfileDetails implements AppModel {
    constructor(
        public name: string,
        public address: string,
        public email?: string,
        public walletAddress?: string,
        public socialAccounts?: ProfileSocialAccount[]
    ) { }

    static getFromDTO(dto: ProfileDetailsDTO): ProfileDetails {
        return new ProfileDetails(
            dto.name,
            dto.address,
            dto.email,
            dto.ethAddress,
            dto.socialAccounts?.map(socialAccount => ProfileSocialAccount.getFromDTO(socialAccount))
        )
    }

    toDTO(): ProfileDetailsDTO {
        return {
            name: this.name,
            address: this.address,
            socialAccounts: this.socialAccounts?.map(socialAccount => socialAccount.toDTO())
        }
    }
}

export class ProfileSocialAccount {
    constructor(
        public username: string,
        public profileUrl: string,
        public type: string
    ) { }

    static getFromDTO(dto: ProfileSocialAccountDTO): ProfileSocialAccount {
        return new ProfileSocialAccount(dto.username, dto.profileUrl, dto.type)
    }

    static init(type: SocialAccountType): ProfileSocialAccount {
        return new ProfileSocialAccount('', '', type.key);
    }

    toDTO(): ProfileSocialAccountDTO {
        return {
            username: this.username,
            profileUrl: this.profileUrl,
            type: this.type
        }
    }
}