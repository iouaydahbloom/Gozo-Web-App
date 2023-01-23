import {useCallback} from "react";

export class CloudResponse<T> {
    constructor(public message: string,
                public errors: any,
                public data: T,
                public isSuccess: boolean) {
    }
}

const useCloud = () => {

    const accessToken = 'qwe213sqade4325wsqdad1231234sacasc';

    const run = useCallback(async <T, Y>(
        functionName: string,
        params: any,
        mapper?: (args: Y) => T,
        isPrivate: boolean = false
    ): Promise<CloudResponse<T>> => {
        return Promise.resolve(new CloudResponse('success', null, [] as any, true));
    }, [accessToken])

    return {
        run
    }
}

export default useCloud;