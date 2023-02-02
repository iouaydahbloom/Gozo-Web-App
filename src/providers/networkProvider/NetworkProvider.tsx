import React, { useEffect, useState } from "react";
import { networkContext } from "./networkContext";
import { Network } from '@capacitor/network';

const NetworkProvider: React.FC = ({ children }) => {

    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        Network.getStatus().then(status => {
            setIsOnline(status.connected);
        })

        Network.addListener('networkStatusChange', status => {
            setIsOnline(status.connected);
        });
    }, [])

    return (
        <networkContext.Provider value={{ isOnline }}>
            {children}
        </networkContext.Provider>
    )
}

export default NetworkProvider;