import { createContext } from "react";
import { CommonContextProp } from "../CommonContextProp";

export interface IOnBoardingPreviewState extends CommonContextProp {
    isHidden: boolean,
    hide: () => void
}

export const OnBoardingPreviewContext = createContext<IOnBoardingPreviewState>({
    isHidden: false,
    hide: () => null,
    isReady: false,
    refresh: () => Promise.resolve()
});