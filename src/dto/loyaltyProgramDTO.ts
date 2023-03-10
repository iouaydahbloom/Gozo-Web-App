import { BrandDTO } from "./brandDTO"
import { DynamicInputIdentifierDTO } from "./dynamicInputIdentifierDTO"
import { RedemptionDTO } from "./redemptionDTO"
import { ValueIdentifierDTO } from "./valueIdentifierDTO"

export interface LoyaltyProgramDTO {
    company_name: string,
    logo: string,
    loyalty_currency: LoyaltyCurrencyDTO,
    partner_id: string,
    partnership_details?: LoyaltyPartnershipDetailsDTO,
    active_partnerships?: ActivePartnershipDetailsDTO,
    brand?: BrandDTO,
    base64Logo?: string
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

export interface ActivePartnershipDetailsDTO {
    exchange_in: boolean,
    exchange_out: boolean,
    redemption: boolean,
    issuing: boolean,
    currency_owner_for_issuance: boolean,
    currency_owner_for_redemption: boolean
}

export interface MyLoyaltyProgramDTO {
    company_name: string,
    program_id: string,
    program_logo: string,
    ca_loyalty_currency: string,
    ca_loyalty_currency_name: string,
    membership_data: ValueIdentifierDTO[],
    exchange_in: boolean,
    exchange_out: boolean,
    redemption: boolean,
    issuing: boolean,
    program_base64_logo?: string
}

export interface UserLoyaltyProgramDTO {
    caCurrency: UserLoyaltyProgramCurrencyDTO,
    caMemberFields: DynamicInputIdentifierDTO[],
    createdAt: string,
    updatedAt: string,
    objectId: string,
    userCurrencyId: string,
    redemption: RedemptionDTO
}

export interface UserLoyaltyProgramCurrencyDTO {
    caLoyaltyCurrency: string,
    caLoyaltyCurrencyName: string,
    companyName: string,
    createdAt: string,
    updatedAt: string,
    objectId: string,
    programId: string,
    programLogo: string,
    isExchangeIn: boolean,
    isExchangeOut: boolean,
    isRedemption: boolean,
    isIssuing: boolean
}