import { Magic } from "magic-sdk";
import { appConfig } from "../../constants/appConfig";
import { magicAuthContext } from "./magicAuthContext";

const MagicAuthProvider: React.FC = ({ children }) => {
    return (
        <magicAuthContext.Provider value={{
            magic: new Magic(appConfig.magicPublicKey, {
                network: {
                    rpcUrl: appConfig.nodeRPCUrl,
                    chainId: parseInt(appConfig.chainId)
                }
            })
        }}>
            {children}
        </magicAuthContext.Provider>
    )
}

export default MagicAuthProvider;