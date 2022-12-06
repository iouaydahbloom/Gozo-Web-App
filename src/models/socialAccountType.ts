import { SocialAccountTypeDTO } from "../dto/socialAccountTypeDTO";

export class SocialAccountType {
    constructor(
        public key: string,
        public name: string,
        public logo: string,
    ) { }

    static getFromDTO(dto: SocialAccountTypeDTO): SocialAccountType {
        return new SocialAccountType(
            dto.key,
            dto.name,
            dto.logo
        )
    }
}