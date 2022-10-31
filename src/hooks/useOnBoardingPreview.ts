import { useContext } from "react";
import { hiddenOnboardingScreen } from "../constants/storageKeys";
import InternalStorage from "../helpers/InternalStorage";
import { OnBoardingPreviewContext } from "../providers/OnBoardingPreviewProvider/onBoardingPreviewContext";

const useOnBoardingPreview = () => {
    const { isHidden, hide, isReady } = useContext(OnBoardingPreviewContext);

    async function hideOnBoarding() {
        if (isHidden) return
        await InternalStorage.setInStorage(hiddenOnboardingScreen, true);
        hide();
    }

    return {
        isHidden,
        isReady,
        hide: hideOnBoarding,
    }
}

export default useOnBoardingPreview;