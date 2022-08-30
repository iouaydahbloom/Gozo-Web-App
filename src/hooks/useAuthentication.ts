import { useMoralis } from "react-moralis";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";

const useAuthentication = () => {

    const { authenticate, isAuthenticated, isAuthenticating, user, authError, logout } = useMoralis();
    const { run } = useCloud();

    const login = async () => {
        if (!isAuthenticated) {
            await authenticate({
                provider: "web3Auth",
                clientId: process.env.REACT_APP_WEB3AUTH_SECRET ?? ''
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
        isAuthenticating,
        user,
        authError,
        logout
    }
}

export default useAuthentication;