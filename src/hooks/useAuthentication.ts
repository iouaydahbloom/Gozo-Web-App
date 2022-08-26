import { useMoralis } from "react-moralis";
import { chainHex } from "../helpers/networks";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";

const useAuthentication = () => {

    const { authenticate, isAuthenticated, user, authError, logout } = useMoralis();
    const { run } = useCloud();

    const login = async () => {
        if (!isAuthenticated) {
            await authenticate({
                provider: "web3Auth",
                clientId: process.env.REACT_APP_WEB3AUTH_SECRET ?? '',
                //chainId: chainHex.Fuji as any
            })
                .then(async (user) => {
                    console.log(user);
                    if (user) {
                        await activateMember(user.id, user.getUsername() ?? '');
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    async function activateMember(id: string, name: string) {
        return run(cloudFunctionName.activateLoyaltyMember, { id, name }, (result: any) => true);
    }

    return {
        login,
        isAuthenticated,
        user,
        authError,
        logout
    }
}

export default useAuthentication;