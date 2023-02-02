import { createContext } from "react";

export interface IWheelSettingsState {
    isMuted: boolean,
    toggle: (isMuted: boolean) => void
}

export const WheelSettingsContext = createContext<IWheelSettingsState>({
    isMuted: false,
    toggle: (isMuted: boolean) => null
});