import { createContext } from "react";

export interface IOnBoardingPreviewState {
    isHidden: boolean,
    hide: () => void,
    isReady: boolean
}

export const OnBoardingPreviewContext = createContext<IOnBoardingPreviewState>({
    isHidden: false,
    hide: () => null,
    isReady: false
});