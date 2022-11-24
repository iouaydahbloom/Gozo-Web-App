import { createContext, Dispatch } from "react";

export interface ITabState {
    tabHeight: number,
    setTabHeight: Dispatch<any>
}

export const TabHeightContext = createContext<ITabState>({
    tabHeight: 0,
    setTabHeight : () => null
});