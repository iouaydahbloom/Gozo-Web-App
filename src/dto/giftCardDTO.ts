export interface GiftCardDTO {
    id: string,
    name: string,
    image: string,
    description: string,
    expiration_policy: string,
    denominations: string[],
    currency: string,
    maximum_value: string,
    minimum_value: string,
    terms_and_conditions_url: string
}
