import { useState } from "react";
import { TabHeaderHeightContext } from "./tabHeaderHeightContext";

interface Props {
  children: React.ReactNode
}

const TabHeaderHeightProvider: React.FC<Props> = ({ children }) => {
  const [tabHeaderHeight, setTabHeaderHeight] = useState<number>(0);
  const [tabRef, setTabRef] = useState<any>();
  
  return (
    <TabHeaderHeightContext.Provider value={{ tabHeaderHeight, setTabHeaderHeight, tabRef, setTabRef }}>
      {children}
    </TabHeaderHeightContext.Provider>
  )
}

export default TabHeaderHeightProvider