import { useEffect, useState } from "react";
import { hiddenOnboardingScreen } from "../../constants/storageKeys";
import InternalStorage from "../../helpers/InternalStorage";
import { OnBoardingPreviewContext } from "./onBoardingPreviewContext";

interface Props {
  children: React.ReactNode
}


const OnBoardingPreviewProvider: React.FC<Props> = ({ children }) => {

  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    InternalStorage.getFromStorage<boolean>(hiddenOnboardingScreen)
      .then(isHidden => {
        setIsHidden(isHidden);
        setIsReady(true);
      });
  }, [])

  return (
    <OnBoardingPreviewContext.Provider value={{ hide: () => setIsHidden(true), isHidden, isReady }}>
      {children}
    </OnBoardingPreviewContext.Provider>
  )
}

export default OnBoardingPreviewProvider