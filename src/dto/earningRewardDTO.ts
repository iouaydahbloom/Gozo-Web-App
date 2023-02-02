import { EarningActionType } from "../types/earningActionType";

export interface EarningRewardDTO {
    name: string,
    _id: string,
    description: string,
    key: string,
    type: EarningActionType,
    logoUrl: string,
    url: string,
    zapierActionId: string
}