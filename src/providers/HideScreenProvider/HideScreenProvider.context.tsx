import { createContext, useState } from "react";

interface Props {
  children: React.ReactNode
}

export interface IHideScreen {
  hideScreen: boolean,
  setHideScreen: React.Dispatch<React.SetStateAction<boolean>>
}

export const HideScreenContext = createContext<IHideScreen | boolean>(false);

const HideScreenProviderContext: React.FC<Props> = ({ children }) => {

  const [hideScreen, setHideScreen] = useState<boolean>(false);

  //The Store object
  let state: IHideScreen = { hideScreen, setHideScreen };

  return <HideScreenContext.Provider value={state}>{children}</HideScreenContext.Provider>
}

export default HideScreenProviderContext