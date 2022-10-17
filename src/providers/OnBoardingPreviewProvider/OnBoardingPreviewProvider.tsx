import { useEffect, useState } from "react";
import { hiddenOnboardingScreen } from "../../constants/storageKeys";
import InternalStorage from "../../helpers/InternalStorage";
import { OnBoardingPreviewContext } from "./onBoardingPreviewContext";

interface Props {
  children: React.ReactNode
}


const OnBoardingPreviewProvider: React.FC<Props> = ({ children }) => {

  const [isHidden, setIsHidden] = useState<boolean>(false);

  useEffect(() => {
    InternalStorage.getFromStorage<boolean>(hiddenOnboardingScreen)
      .then(isHidden => {
        setIsHidden(isHidden)
      });
  }, [])

  return (
    <OnBoardingPreviewContext.Provider value={{ hide: () => setIsHidden(true), isHidden }}>
      {children}
    </OnBoardingPreviewContext.Provider>
  )
}

export default OnBoardingPreviewProvider