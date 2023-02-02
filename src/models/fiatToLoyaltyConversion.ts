import { FiatToLoyaltyConversionDTO } from "../dto/fiatToLoyaltyConversionDTO";

export class FiatToLoyaltyConversion {
    constructor(
        public fiatCost: string,
        public loyaltyAmount: number
    ) { }

    static fromDTO(dto: FiatToLoyaltyConversionDTO) {
        return new FiatToLoyaltyConversion(dto.exact_fiat_cost, dto.loyalty_amount);
    }
}