import { UserEarningDTO } from "../dto/userEarningDTO";
import AppModel from "./appModel";


export class UserEarning implements AppModel {
    constructor(
        public id: string,
        public earningActionId: string
        ) { }

    static getFromDTO(dto: UserEarningDTO): UserEarning {
        return new UserEarning(dto._id, dto.earningsActionId)
    }

    toDTO() { }
}