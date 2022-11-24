import { createContext } from "react";
import { WaitableContextProp } from "../waitableContextProp";

export interface IOnBoardingPreviewState extends WaitableContextProp {
    isHidden: boolean,
    hide: () => void
}

export const OnBoardingPreviewContext = createContext<IOnBoardingPreviewState>({
    isHidden: false,
    hide: () => null,
    isReady: false,
    refresh: () => Promise.resolve()
});