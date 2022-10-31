import React, { useState } from "react";
import { primaryContainerContext } from "./primaryContainerContext";

const PrimaryContainerProvider: React.FC = ({ children }) => {

    const [isRefreshing, setIsRefreshing] = useState(false);

    return (
        <primaryContainerContext.Provider value={{ isRefreshing, setIsRefreshing }}>
            {children}
        </primaryContainerContext.Provider>
    )
}

export default PrimaryContainerProvider;