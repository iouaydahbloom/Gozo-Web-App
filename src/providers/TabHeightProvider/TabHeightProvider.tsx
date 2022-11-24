import { useState } from "react";
import { TabHeightContext } from "./tabHeightContext";


interface Props {
  children: React.ReactNode
}


const TabHeightProvider: React.FC<Props> = ({ children }) => {
  const [tabHeight, setTabHeight] = useState<number>(0);

  return (
    <TabHeightContext.Provider value={{ tabHeight, setTabHeight}}>
      {children}
    </TabHeightContext.Provider>
  )
}

export default TabHeightProvider