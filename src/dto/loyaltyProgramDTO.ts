import { DynamicInputIdentifierDTO } from "./dynamicInputIdentifierDTO"
import { ValueIdentifierDTO } from "./valueIdentifierDTO"

export interface LoyaltyProgramDTO {
    company_name: string,
    logo: string,
    loyalty_currency: LoyaltyCurrencyDTO,
    partner_id: string,
    partnership_details: LoyaltyPartnershipDetailsDTO
}

export interface LoyaltyCurrencyDTO {
    id: string,
    short_name: string
}

export interface LoyaltyProgramRequireFieldDTO {
    id: string,
    name: string
}

export interface LoyaltyExecuteActionDTO {
    required_fields: LoyaltyProgramRequireFieldDTO[]
}

export interface LoyaltyMemberLookupActionDTO {
    member_lookup_available: boolean,
    required_fields: LoyaltyProgramRequireFieldDTO[]
}

export interface LoyaltyPartnershipDetailsDTO {
    batch_process: boolean,
    execute_action: LoyaltyExecuteActionDTO,
    member_lookup_action: LoyaltyMemberLookupActionDTO
}

export interface MyLoyaltyProgramsDTO {
    programs: MyLoyaltyProgramDTO[]
}

export interface MyLoyaltyProgramDTO {
    company_name: string,
    program_id: string,
    program_logo: string,
    ca_loyalty_currency: string,
    ca_loyalty_currency_name: string,
    membership_data: ValueIdentifierDTO[]
}

export interface UserLoyaltyProgramDTO {
    caCurrency: UserLoyaltyProgramCurrencyDTO,
    caCurrencyId: string,
    caMemberFields: DynamicInputIdentifierDTO[],
    createdAt: string,
    updatedAt: string,
    objectId: string,
    userCurrencyId: string
}

export interface UserLoyaltyProgramCurrencyDTO {
    caLoyaltyCurrency: string,
    caLoyaltyCurrencyName: string,
    companyName: string,
    createdAt: string,
    updatedAt: string,
    objectId: string,
    programId: string,
    programLogo: string
}