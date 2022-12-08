import { RewardRequiredDataDTO } from "./rewardRequiredDataDTO";

export interface PrizeDTO {
    name: string,
    _id: string,
    description: string,
    label: string,
    caLoyaltyCurrency: string,
    logoUrl: string,
    required_data: RewardRequiredDataDTO[]
}
