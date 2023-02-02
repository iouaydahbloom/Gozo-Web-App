
import { PlayGameDTO } from "../dto/PlayGameDTO";
import AppModel from "./appModel";


export class PlayGame implements AppModel {
    constructor(
        public prizeId: string,
        public gameToken: string,
        public spinResult: boolean
        ) { }

    static getFromDTO(dto: PlayGameDTO): PlayGame {
        return new PlayGame(dto.prizeId, dto.gameToken, dto.spinResult)
    }

    toDTO() { }
}