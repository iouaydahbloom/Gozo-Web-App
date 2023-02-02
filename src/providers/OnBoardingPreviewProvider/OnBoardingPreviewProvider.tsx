import { useCallback, useEffect, useState } from "react";
import { hiddenOnboardingScreen } from "../../constants/storageKeys";
import InternalStorage from "../../helpers/InternalStorage";
import { OnBoardingPreviewContext } from "./onBoardingPreviewContext";

interface Props {
  children: React.ReactNode
}

const OnBoardingPreviewProvider: React.FC<Props> = ({ children }) => {

  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isReady, setIsReady] = useState(false);

  const initOnboardingPreview = useCallback(async () => {
    return InternalStorage.getFromStorage<boolean>(hiddenOnboardingScreen)
      .then(isHidden => {
        setIsHidden(isHidden);
        setIsReady(true);
      });
  }, [])

  useEffect(() => {
    initOnboardingPreview();
  }, [])

  return (
    <OnBoardingPreviewContext.Provider value={{
      hide: () => setIsHidden(true),
      isHidden,
      isReady,
      refresh: initOnboardingPreview
    }}>
      {children}
    </OnBoardingPreviewContext.Provider>
  )
}

export default OnBoardingPreviewProvider