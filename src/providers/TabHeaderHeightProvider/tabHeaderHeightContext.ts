import { createContext, Dispatch } from "react";

export interface ITabHeaderState {
    tabHeaderHeight: number,
    tabRef: any | undefined, 
    setTabRef: Dispatch<any>,
    setTabHeaderHeight: Dispatch<any>
}

export const TabHeaderHeightContext = createContext<ITabHeaderState>({
    tabHeaderHeight: 0,
    setTabHeaderHeight : () => null,
    tabRef: undefined, 
    setTabRef: () => null
});