import { useContext, useState } from "react";
import { magicAuthContext } from "../providers/MagicAuthProvider/magicAuthContext";
import { ethers } from 'ethers';

const useMagicAuth = () => {

    const { magic } = useContext(magicAuthContext);
    const [isConnecting, setIsConnecting] = useState(false);

    function connect(email: string) {
        setIsConnecting(true);
        return magic?.auth
            .loginWithMagicLink({ email })
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
        disconnect,
        isConnecting,
        user: magic?.user,
        getProviderSigner
    }
}

export default useMagicAuth;