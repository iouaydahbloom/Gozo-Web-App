import { useMoralis } from "react-moralis";

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
    const { Moralis, user } = useMoralis();

    function resolveParams(params: any, isPrivate: boolean) {
        let updatedParams = params;
        if (isPrivate) {
            if (updatedParams) updatedParams.token = user?.getSessionToken();
            else updatedParams = { token: user?.getSessionToken() };
        }
        return updatedParams;
    }

    async function run<T, Y>(functionName: string, params: any, mapper: (args: Y) => T, isPrivate: boolean = false): Promise<CloudResponse<T>> {
        return Moralis.Cloud
            .run(functionName, resolveParams(params, isPrivate))
            .then((result: SuccessResponse<Y>) => {
                console.log(`Cloud result for ${functionName} is `, result);
                const data = mapper ? mapper(result.data) : result.data as any as T;
                return new CloudResponse<T>(result.message, null, data, true);
            })
            .catch((error: ErrorResponse) => {
                console.log(`Cloud error for ${functionName} is `, error);
                return new CloudResponse<T>(error.message, error.errors, {} as any, false)
            })
    }

    return {
        run: run
    }
}

export default useCloud;