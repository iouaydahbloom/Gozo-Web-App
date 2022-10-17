import { createContext } from "react";

export interface IOnBoardingPreviewState {
    isHidden: boolean,
    hide: () => void
}

export const OnBoardingPreviewContext = createContext<IOnBoardingPreviewState>({
    isHidden: false,
    hide: () => null
});