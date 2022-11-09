
import { PlayGameDTO } from "../dto/PlayGameDTO";
import AppModel from "./appModel";


export class PlayGame implements AppModel {
    constructor(
        public gameToken: string,
        public spinResult: boolean
        ) { }

    static getFromDTO(dto: PlayGameDTO): PlayGame {
        return new PlayGame(dto.gameToken, dto.spinResult)
    }

    toDTO() { }
}