import { DefaultCurrencyDTO } from "../dto/defaultCurrencyDTO";
import { LoyaltyCurrencyDTO, LoyaltyExecuteActionDTO, LoyaltyMemberLookupActionDTO, LoyaltyPartnershipDetailsDTO, LoyaltyProgramDTO, LoyaltyProgramRequireFieldDTO, MyLoyaltyProgramDTO, MyLoyaltyProgramsDTO, UserLoyaltyProgramCurrencyDTO, UserLoyaltyProgramDTO } from "../dto/loyaltyProgramDTO";
import AppModel from "./appModel"
import { DynamicInputIdentifier } from "./dynamicInputIdentifier";
import { ValueIdentifier } from "./valueIdentifier";

export class LoyaltyProgram implements AppModel {
    constructor(public companyName: string,
        public logo: string,
        public loyaltyCurrency: LoyaltyCurrency,
        public partnerId: string,
        public partnershipDetails: LoyaltyPartnershipDetails) { }

    static getFromDTO(dto: LoyaltyProgramDTO): LoyaltyProgram {
        return new LoyaltyProgram(dto.company_name,
            dto.logo,
            LoyaltyCurrency.getFromDTO(dto.loyalty_currency),
            dto.partner_id,
            LoyaltyPartnershipDetails.getFromDTO(dto.partnership_details)
        )
    }

    toDTO() { }
}

export class MyLoyaltyProgram implements AppModel {
    constructor(public companyName: string,
        public programId: string,
        public programLogo: string,
        public caLoyaltyCurrency: string,
        public caLoyaltyCurrencyName: string,
        public membership: ValueIdentifier[],
        public userCurrencyId: string) { }

    static getFromDTO(dto: MyLoyaltyProgramDTO): MyLoyaltyProgram {
        return new MyLoyaltyProgram(dto.company_name,
            dto.program_id,
            dto.program_logo,
            dto.ca_loyalty_currency,
            dto.ca_loyalty_currency_name,
            dto.membership_data.map(md => {
                return ValueIdentifier.getFromDTO(md)
            }),
            ''
        )
    }

    toDTO(): MyLoyaltyProgramDTO {
        return {
            company_name: this.companyName,
            program_id: this.programId,
            program_logo: this.programLogo,
            ca_loyalty_currency: this.caLoyaltyCurrency,
            ca_loyalty_currency_name: this.caLoyaltyCurrencyName,
            membership_data: this.membership.map(m => m.toDTO())
        }
    }
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
            dto.caCurrencyId,
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
            new UserLoyaltyProgramCurrency(dto.currency_id, dto.curency_display_name, '', new Date(), '', '', ''),
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
        public programLogo: string) { }

    static getFromDTO(dto: UserLoyaltyProgramCurrencyDTO): UserLoyaltyProgramCurrency {
        return new UserLoyaltyProgramCurrency(
            dto.caLoyaltyCurrency,
            dto.caLoyaltyCurrencyName,
            dto.companyName,
            new Date(dto.createdAt),
            dto.objectId,
            dto.programId,
            dto.programLogo
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