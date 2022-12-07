export interface ProfileDetailsDTO {
    email?: string,
    ethAddress?: string,
    name: string,
    objectId?: string,
    username?: string,
    address: string,
    socialAccounts?: ProfileSocialAccountDTO[]
}


export interface ProfileSocialAccountDTO {
    username: string,
    profileUrl: string,
    type: string
}