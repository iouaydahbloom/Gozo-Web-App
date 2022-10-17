import { hiddenOnboardingScreen } from "../constants/storageKeys";
import InternalStorage from "./InternalStorage";

export async function  isOnboardingShown(): Promise<boolean> {
    const isShown = await InternalStorage.getFromStorage<boolean>(hiddenOnboardingScreen);
    return isShown;
}

export async function hideOnboarding() {
    return await InternalStorage.setInStorage(hiddenOnboardingScreen, true);
}