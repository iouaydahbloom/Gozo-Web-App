import { RedemptionDTO } from "../dto/redemptionDTO";
import AppModel from "./appModel";


export class Redemption implements AppModel {
    constructor(
        public spinCost: number,
        public isSufficient: boolean
        ) { }

    static getFromDTO(dto: RedemptionDTO): Redemption {
        return new Redemption(dto.total_loyalty_amount, dto.sufficient_balance)
    }

    toDTO() { }
}