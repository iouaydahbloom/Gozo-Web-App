import { useEffect, useState } from "react";
import { mutedWheelSound } from "../../constants/storageKeys";
import InternalStorage from "../../helpers/InternalStorage";
import { WheelSettingsContext } from "./wheelSettingsContext";


interface Props {
  children: React.ReactNode
}


const WheelSettingsProvider: React.FC<Props> = ({ children }) => {

  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    InternalStorage.getFromStorage<boolean>(mutedWheelSound)
      .then(isMuted => {
        setIsMuted(isMuted);
      });
  }, [])

  const toggle = (isMuted : boolean) => {
    InternalStorage.setInStorage(mutedWheelSound, isMuted)
    setIsMuted(isMuted)
  }

  return (
    <WheelSettingsContext.Provider value={{ toggle: toggle, isMuted }}>
      {children}
    </WheelSettingsContext.Provider>
  )
}

export default WheelSettingsProvider