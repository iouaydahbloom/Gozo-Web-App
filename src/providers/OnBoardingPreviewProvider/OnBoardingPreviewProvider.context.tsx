import { createContext, useState } from "react";

interface Props {
  children: React.ReactNode
}

export interface IHideOnBoarding {
  hideOnBoarding: boolean,
  setHideOnBoarding: React.Dispatch<React.SetStateAction<boolean>>
}

export const OnBoardingPreviewContext = createContext<IHideOnBoarding | boolean>(false);

const OnBoardingPreviewProvider: React.FC<Props> = ({ children }) => {

  const [hideOnBoarding, setHideOnBoarding] = useState<boolean>(false);

  //The Store object
  let state: IHideOnBoarding = { hideOnBoarding, setHideOnBoarding };

  return <OnBoardingPreviewContext.Provider value={state}>{children}</OnBoardingPreviewContext.Provider>
}

export default OnBoardingPreviewProvider