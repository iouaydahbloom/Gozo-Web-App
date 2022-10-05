import { DefaultCurrencyDTO } from "../dto/defaultCurrencyDTO";
import { ActivePartnershipDetailsDTO, LoyaltyCurrencyDTO, LoyaltyExecuteActionDTO, LoyaltyMemberLookupActionDTO, LoyaltyPartnershipDetailsDTO, LoyaltyProgramDTO, LoyaltyProgramRequireFieldDTO, MyLoyaltyProgramDTO, UserLoyaltyProgramCurrencyDTO, UserLoyaltyProgramDTO } from "../dto/loyaltyProgramDTO";
import AppModel from "./appModel"
import { Brand } from "./brand";
import { DynamicInputIdentifier } from "./dynamicInputIdentifier";

export class LoyaltyProgram implements AppModel {
    constructor(public companyName: string,
        public logo: string,
        public loyaltyCurrency: LoyaltyCurrency,
        public partnerId: string,
        public partnershipDetails: LoyaltyPartnershipDetails | null,
        public activePartnerships: ActivePartnershipDetails | null,
        public brand: Brand | null) { }

    static getFromDTO(dto: LoyaltyProgramDTO): LoyaltyProgram {
        return new LoyaltyProgram(dto.company_name,
            dto.logo,
            LoyaltyCurrency.getFromDTO(dto.loyalty_currency),
            dto.partner_id,
            dto.partnership_details ? LoyaltyPartnershipDetails.getFromDTO(dto.partnership_details) : null,
            dto.active_partnerships ? ActivePartnershipDetails.getFromDTO(dto.active_partnerships) : null,
            dto.brand ? Brand.getFromDTO(dto.brand) : null
        )
    }

    toDTO() { }
}

export class UserLoyaltyProgram implements AppModel {
    constructor(public currency: UserLoyaltyProgramCurrency,
        public currencyId: string,
        public memberFields: DynamicInputIdentifier[],
        public createdAt: Date,
        public id: string,
        public userCurrencyId: string) { }

    static getFromDTO(dto: UserLoyaltyProgramDTO): UserLoyaltyProgram {
        return new UserLoyaltyProgram(
            UserLoyaltyProgramCurrency.getFromDTO(dto.caCurrency),
            dto.caCurrency.objectId,
            dto.caMemberFields.map(field => {
                return DynamicInputIdentifier.getFromDTO(field)
            }),
            new Date(dto.createdAt),
            dto.objectId,
            dto.userCurrencyId
        )
    }

    static getFromDefaultCurrencyDTO(dto: DefaultCurrencyDTO): UserLoyaltyProgram {
        return new UserLoyaltyProgram(
            new UserLoyaltyProgramCurrency(dto.currency_id, dto.curency_display_name, '', new Date(), '', '', '', true, true, true, true),
            '',
            [],
            new Date(),
            '',
            ''
        )
    }

    toMyLoyaltyProgramDTO(): MyLoyaltyProgramDTO {
        return {
            ca_loyalty_currency: this.currency.loyaltyCurrency,
            ca_loyalty_currency_name: this.currency.loyaltyCurrencyName,
            company_name: this.currency.companyName,
            program_id: this.currency.programId,
            program_logo: this.currency.programLogo,
            exchange_in: this.currency.isExchangeIn,
            exchange_out: this.currency.isExchangeOut,
            redemption: this.currency.isRedemption,
            issuing: this.currency.isIssuing,
            membership_data: this.memberFields.map(field => {
                return {
                    id: field.key,
                    value: field.value
                }
            })
        }
    }

    toDTO() { }
}

export class UserLoyaltyProgramCurrency implements AppModel {
    constructor(public loyaltyCurrency: string,
        public loyaltyCurrencyName: string,
        public companyName: string,
        public createdAt: Date,
        public id: string,
        public programId: string,
        public programLogo: string,
        public isExchangeIn: boolean,
        public isExchangeOut: boolean,
        public isRedemption: boolean,
        public isIssuing: boolean) { }

    static getFromDTO(dto: UserLoyaltyProgramCurrencyDTO): UserLoyaltyProgramCurrency {
        return new UserLoyaltyProgramCurrency(
            dto.caLoyaltyCurrency,
            dto.caLoyaltyCurrencyName,
            dto.companyName,
            new Date(dto.createdAt),
            dto.objectId,
            dto.programId,
            dto.programLogo,
            dto.isExchangeIn,
            dto.isExchangeOut,
            dto.isRedemption,
            dto.isIssuing
        )
    }

    toDTO() { }
}

export class LoyaltyCurrency implements AppModel {
    constructor(public id: string,
        public shortName: string) { }

    static getFromDTO(dto: LoyaltyCurrencyDTO): LoyaltyCurrency {
        return new LoyaltyCurrency(dto.id, dto.short_name)
    }

    toDTO() { }
}

export class LoyaltyProgramRequireField implements AppModel {
    constructor(public id: string,
        public name: string) { }

    static getFromDTO(dto: LoyaltyProgramRequireFieldDTO): LoyaltyProgramRequireField {
        return new LoyaltyProgramRequireField(dto.id, dto.name)
    }

    toDTO() { }
}

export class LoyaltyExecuteAction implements AppModel {
    constructor(public requiredFields: LoyaltyProgramRequireField[]) { }

    static getFromDTO(dto: LoyaltyExecuteActionDTO): LoyaltyExecuteAction {
        return new LoyaltyExecuteAction(
            dto.required_fields.map(required => {
                return LoyaltyProgramRequireField.getFromDTO(required)
            })
        )
    }

    toDTO() { }
}

export class LoyaltyMemberLookupAction implements AppModel {
    constructor(public memberLookupAvailable: boolean,
        public requiredFields: LoyaltyProgramRequireFieldDTO[]) { }

    static getFromDTO(dto: LoyaltyMemberLookupActionDTO): LoyaltyMemberLookupAction {
        return new LoyaltyMemberLookupAction(dto.member_lookup_available,
            dto.required_fields.map(required => {
                return LoyaltyProgramRequireField.getFromDTO(required)
            }))
    }

    toDTO() { }
}

export class LoyaltyPartnershipDetails implements AppModel {
    constructor(public batchProcess: boolean,
        public executeAction: LoyaltyExecuteAction,
        public memberLookupAction: LoyaltyMemberLookupAction) { }

    static getFromDTO(dto: LoyaltyPartnershipDetailsDTO): LoyaltyPartnershipDetails {
        return new LoyaltyPartnershipDetails(dto.batch_process,
            LoyaltyExecuteAction.getFromDTO(dto.execute_action),
            LoyaltyMemberLookupAction.getFromDTO(dto.member_lookup_action))
    }

    toDTO() { }
}

export class ActivePartnershipDetails implements AppModel {
    constructor(public exchangeIn: boolean,
        public exchangeOut: boolean,
        public redemption: boolean,
        public issuing: boolean,
        public currencyOwnerForIssuance: boolean,
        public currencyOwnerForRedemption: boolean) { }

    static getFromDTO(dto: ActivePartnershipDetailsDTO): ActivePartnershipDetails {
        return new ActivePartnershipDetails(dto.exchange_in,
            dto.exchange_out,
            dto.redemption,
            dto.issuing,
            dto.currency_owner_for_issuance,
            dto.currency_owner_for_redemption,
        )
    }
    toDTO() { }
}