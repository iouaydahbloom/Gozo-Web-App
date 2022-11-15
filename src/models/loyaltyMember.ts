import { LoyaltyMemberDTO, LoyaltyMemberHistoryDTO } from "../dto/loyaltyMemberDTO";
import AppModel from "./appModel";

export class LoyaltyMember implements AppModel {
    constructor(
        public additionalInformation: any,
        public addressLine1: string,
        public addressLine2: string,
        public addressLine3: string,
        public balance: number,
        public birthDate: string,
        public city: string,
        public country: string,
        public email: string,
        public firstName: string,
        public gender: string,
        public id: string,
        public lastName: string,
        public loyaltyCurrency: string,
        public phoneNumber: string,
        public postalCode: string,
        public state: string,
        public tier: string,
        public loyaltyProgramId: string) { }

    static getFromDTO(dto: LoyaltyMemberDTO): LoyaltyMember {
        return new LoyaltyMember(
            dto.additional_information,
            dto.address_line1,
            dto.address_line2,
            dto.address_line3,
            dto.balance,
            dto.birth_date,
            dto.city,
            dto.country,
            dto.email,
            dto.first_name,
            dto.gender,
            dto.id,
            dto.last_name,
            dto.loyalty_currency,
            dto.phone_number,
            dto.postal_code,
            dto.state,
            dto.tier,
            dto.loyalty_program_identifiers?.id
        )
    }

    toDTO() { }
}

export class LoyaltyMemberHistory implements AppModel {
    constructor(
        public amount: number,
        public completed_at: string | null,
        public created_at: string,
        public external_reference: string,
        public id: string,
        public loyalty_currency: string,
        public loyalty_system_data: string | null,
        public loyalty_system_id: string | null,
        public reason: string,
        public reason_code: string,
        public related_data: any,
        public release_date: any,
        public status: string,
        public status_message: string,
        public status_message_code: string,
        public sub_type: string,
        public type: string
    ) { }

    static getFromDTO(dto: LoyaltyMemberHistoryDTO): LoyaltyMemberHistory {
        return new LoyaltyMemberHistory(
            dto.amount,
            dto.completed_at,
            dto.created_at,
            dto.external_reference,
            dto.id,
            dto.loyalty_currency,
            dto.loyalty_system_data,
            dto.loyalty_system_id,
            dto.reason,
            dto.reason_code,
            dto.related_data,
            dto.release_date,
            dto.status,
            dto.status_message,
            dto.status_message_code,
            dto.sub_type,
            dto.type
        )
    }

    toDTO() { }

    static isBalanceSubtracted(historyField: LoyaltyMemberHistory) {
        return historyField.type === 'redemption' ||
            (historyField.type === 'member_exchange' && historyField.sub_type === 'out')
    }
}