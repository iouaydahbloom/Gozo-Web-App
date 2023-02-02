export interface LoyaltyMemberDTO {
    additional_information: any,
    address_line1: string,
    address_line2: string,
    address_line3: string,
    balance: number,
    birth_date: string,
    city: string,
    country: string,
    email: string,
    first_name: string,
    gender: string,
    id: string,
    last_name: string,
    loyalty_currency: string,
    phone_number: string,
    postal_code: string,
    state: string,
    tier: string,
    loyalty_program_identifiers: { id: string }
}

export interface LoyaltyMemberHistoryDTO {
    amount: number,
    completed_at: string | null,
    created_at: string,
    destination_account: LoyaltyMemberAccountDTO,
    external_reference: string,
    id: string,
    loyalty_currency: string,
    loyalty_system_data: string | null,
    loyalty_system_id: string | null,
    metadata: any,
    origin_account: LoyaltyMemberAccountDTO,
    reason: string,
    reason_code: string,
    related_data: any,
    release_date: any,
    status: string,
    status_message: string,
    status_message_code: string,
    sub_type: string,
    type: string
}

export interface LoyaltyMemberAccountDTO {
    id: string,
    owner: LoyaltyMemberAccountOwnerDTO
}

export interface LoyaltyMemberAccountOwnerDTO {
    id: string
    type: string
}