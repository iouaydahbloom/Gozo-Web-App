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
    ca_currency: UserLoyaltyProgramCurrencyDTO,
    ca_currency_id: number,
    ca_member_fields: DynamicInputIdentifierDTO[],
    created_at: number,
    id: number,
    user_id: number
}

export interface UserLoyaltyProgramCurrencyDTO {
    ca_loyalty_currency: string,
    ca_loyalty_currency_name: string,
    company_name: string,
    created_at: number,
    id: number,
    program_id: string,
    program_logo: string
}