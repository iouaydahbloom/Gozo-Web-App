import { GiftCardDTO } from "../dto/giftCardDTO";
import AppModel from "./appModel";

export class GiftCard implements AppModel {
    constructor(
        public id: string,
        public name: string,
        public image: string,
        public description: string,
        public validity: string,
        public hasFixedAvailabilities: boolean,
        public availabilty: string[],
        public currency: string,
        public minimumValue: string,
        public maximumValue: string,
        public termsAndConditionsHtml: string,
        public termsAndConditionsUrl: string,
    ) { }

    static getFromDTO(dto: GiftCardDTO): GiftCard {
        return new GiftCard(
            dto.id,
            dto.name,
            dto.image,
            dto.description,
            dto.expiration_policy,
            dto.denomination_type === 'fixed',
            dto.denominations ? dto.denominations.map(item => item) : [],
            dto.currency,
            dto.minimum_value,
            dto.maximum_value,
            dto.terms_and_conditions_html,
            dto.terms_and_conditions_url
        )
    }

    toDTO() { }
}