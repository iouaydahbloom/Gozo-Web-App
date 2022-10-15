import { hideSplashAndOnboardingScreenSK } from "../constants/storageKeys";
import InternalStorage from "../helpers/InternalStorage";


const useHideScreen = () => {
    const storeHideFlag = async () => {
        return await InternalStorage.setInStorage(hideSplashAndOnboardingScreenSK, true)
    }

    const getHideFlag = async (): Promise<boolean> => {
        const result = await InternalStorage.getFromStorage<boolean>(hideSplashAndOnboardingScreenSK);
        return result;
    }

    return {
        getHideFlag,
        storeHideFlag
    }
}

export default useHideScreen;