import { RewardDTO } from "../dto/RewardDTO";
import AppModel from "./appModel";


export class Reward implements AppModel {
    constructor(
        public id: string,
        public name: string,
        public caLoyaltyCurrency: string,
        public date: string,
        public icon?: string
        ) { }

    static getFromDTO(dto: RewardDTO[]): Reward[] {
        return dto.map(item => (new Reward(item.objectId, item.prize.name, item.prize.caLoyaltyCurrency, item.createdAt)))
    }

    toDTO() { }
}