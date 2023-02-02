export interface GiftCardDTO {
    id: string,
    name: string,
    image: string,
    description: string,
    provider: string,
    expiration_policy: string,
    currency: string,
    maximum_value: string,
    minimum_value: string,
    terms_and_conditions_html: string,
    terms_and_conditions_url: string,
    denomination_type: string,
    denominations: string[]
}
