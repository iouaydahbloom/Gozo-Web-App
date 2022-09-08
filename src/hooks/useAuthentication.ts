import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import useWeb3 from "./useBlockchain";

const useAuthentication = () => {

    const { authenticate, isAuthenticated, isAuthenticating, user, authError, logout } = useWeb3();
    const { run } = useCloud();

    async function login(email: string) {
        if (!isAuthenticated) {
            await authenticate(email)
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