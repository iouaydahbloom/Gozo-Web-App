import { useContext, useState } from "react";
import { magicAuthContext } from "../providers/MagicAuthProvider/magicAuthContext";
import { ethers } from 'ethers';

const useMagicAuth = () => {

    const { magic } = useContext(magicAuthContext);
    const [isConnecting, setIsConnecting] = useState(false);

    function connect(email: string) {
        setIsConnecting(true);
        return magic?.auth
            .loginWithEmailOTP({ email })
            .finally(() => setIsConnecting(false))
    }

    function connectWithCredentials(token?: string) {
        setIsConnecting(true);
        return magic?.auth
            .loginWithCredential(token)
            .finally(() => setIsConnecting(false))
    }

    function disconnect() {
        return magic?.user.logout()
    }

    function getProviderSigner() {
        const provider = new ethers.providers.Web3Provider(magic?.rpcProvider as any);
        return provider.getSigner();
    }

    return {
        connect,
        connectWithCredentials,
        disconnect,
        isConnecting,
        user: magic?.user,
        getProviderSigner
    }
}

export default useMagicAuth;