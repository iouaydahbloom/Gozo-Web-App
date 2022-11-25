import { useCallback, useContext } from "react";
import { http } from "../helpers/http";
import { errorHandlerContext } from "../providers/ErrorHandlerProvider/errorHandlerContext";
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

const useCloud = () => {

    const { session } = useContext(sessionContext);
    const { setGlobalError } = useContext(errorHandlerContext);

    const resolveParams = useCallback((params: any, isPrivate: boolean) => {
        let updatedParams = params;
        if (isPrivate) {
            if (updatedParams) updatedParams.token = session?.user?.accessToken;
            else updatedParams = { token: session?.user?.accessToken };
        }
        return updatedParams;
    }, [session?.user.accessToken])

    const run = useCallback(async <T, Y>(
        functionName: string,
        params: any,
        mapper?: (args: Y) => T,
        isPrivate: boolean = false
    ): Promise<CloudResponse<T>> => {
        return http.post<SuccessResponse<Y>>(`/functions/${functionName}`, resolveParams(params, isPrivate))
            .then((result: any) => {
                console.log(`Cloud result for ${functionName} is `, result);
                const data = mapper ? mapper(result.data) : result.data as any as T;
                return new CloudResponse<T>(result.message, null, data, true);
            })
            .catch((error) => {
                console.log(`Cloud error for ${functionName} is `, error);
                setGlobalError(error);
                return new CloudResponse<T>(error.message, error.errors, {} as any, false)
            })
    }, [session?.user.accessToken])

    return {
        run
    }
}

export default useCloud;