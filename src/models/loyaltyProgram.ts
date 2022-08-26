import { DefaultCurrencyDTO } from "../dto/defaultCurrencyDTO";
import { LoyaltyCurrencyDTO, LoyaltyExecuteActionDTO, LoyaltyMemberLookupActionDTO, LoyaltyPartnershipDetailsDTO, LoyaltyProgramDTO, LoyaltyProgramRequireFieldDTO, MyLoyaltyProgramDTO, UserLoyaltyProgramCurrencyDTO, UserLoyaltyProgramDTO } from "../dto/loyaltyProgramDTO";
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
        public membership: ValueIdentifier[]) { }

    static getFromDTO(dto: MyLoyaltyProgramDTO): MyLoyaltyProgram {
        return new MyLoyaltyProgram(dto.company_name,
            dto.program_id,
            dto.program_logo,
            dto.ca_loyalty_currency,
            dto.ca_loyalty_currency_name,
            dto.membership_data.map(md => {
                return ValueIdentifier.getFromDTO(md)
            })
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
        public currencyId: number,
        public memberFields: DynamicInputIdentifier[],
        public createdAt: Date,
        public id: number,
        public userId: number) { }

    static getFromDTO(dto: UserLoyaltyProgramDTO): UserLoyaltyProgram {
        return new UserLoyaltyProgram(
            UserLoyaltyProgramCurrency.getFromDTO(dto.ca_currency),
            dto.ca_currency_id,
            dto.ca_member_fields.map(field => {
                return DynamicInputIdentifier.getFromDTO(field)
            }),
            new Date(dto.created_at),
            dto.id,
            dto.user_id
        )
    }

    static getFromDefaultCurrencyDTO(dto: DefaultCurrencyDTO): UserLoyaltyProgram {
        return new UserLoyaltyProgram(
            new UserLoyaltyProgramCurrency(dto.currency_id, dto.curency_display_name, '', new Date(), 0, '', ''),
            0,
            [],
            new Date(),
            0,
            0
        )
    }

    toMyLoyaltyProgram(): MyLoyaltyProgram {
        return new MyLoyaltyProgram(
            this.currency.companyName,
            this.currency.programId,
            this.currency.programLogo,
            this.currency.loyaltyCurrency,
            this.currency.loyaltyCurrencyName,
            this.memberFields.map(field => {
                return new ValueIdentifier(field.key, field.value)
            })
        )
    }

    toDTO() { }
}

export class UserLoyaltyProgramCurrency implements AppModel {
    constructor(public loyaltyCurrency: string,
        public loyaltyCurrencyName: string,
        public companyName: string,
        public createdAt: Date,
        public id: number,
        public programId: string,
        public programLogo: string) { }

    static getFromDTO(dto: UserLoyaltyProgramCurrencyDTO): UserLoyaltyProgramCurrency {
        return new UserLoyaltyProgramCurrency(
            dto.ca_loyalty_currency,
            dto.ca_loyalty_currency_name,
            dto.company_name,
            new Date(dto.created_at),
            dto.id,
            dto.program_id,
            dto.program_logo
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