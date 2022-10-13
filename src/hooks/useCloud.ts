import { useCallback, useContext } from "react";
import { useMoralis } from "react-moralis";
import { sessionContext } from "../providers/SessionProvider/sessionContext";

export class CloudResponse<T> {
    constructor(public message: string,
        public errors: any,
        public data: T,
        public isSuccess: boolean) { }
}

interface SuccessResponse<T> {
    data: T,
    message: string
}

interface ErrorResponse {
    message: string,
    errors: any
}

const useCloud = () => {
    const { Moralis } = useMoralis();
    const { session } = useContext(sessionContext);

    const resolveParams = useCallback((params: any, isPrivate: boolean) => {
        let updatedParams = params;
        if (isPrivate) {
            if (updatedParams) updatedParams.token = session?.user?.accessToken;
            else updatedParams = { token: session?.user?.accessToken };
        }
        return updatedParams;
    }, [session?.user.accessToken])

    const run = useCallback(async <T, Y>(functionName: string, params: any, mapper: (args: Y) => T, isPrivate: boolean = false): Promise<CloudResponse<T>> => {
        return Moralis.Cloud
            .run(functionName, resolveParams(params, isPrivate))
            .then((result: SuccessResponse<Y>) => {
                console.log(`Cloud result for ${functionName} is `, result);
                const data = mapper ? mapper(result.data) : result.data as any as T;
                return new CloudResponse<T>(result.message, null, data, true);
            })
            .catch((error) => {
                console.log(`Cloud error for ${functionName} is `, error);
                const message = typeof error.message == 'string' ? error.message : '';
                const errors = typeof error.message == 'object' ? error.message : null;
                return new CloudResponse<T>(message, errors, {} as any, false)
            })
    }, [session?.user.accessToken, Moralis.Cloud])

    return {
        run: run
    }
}

export default useCloud;