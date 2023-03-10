import {useMutation, useQueryClient} from "react-query";
import useDataQueryInvalidation from "./useDataQueryInvalidation";

interface Props<TArgs> {
    fn: (args: TArgs) => Promise<any>,
    mutatedIdentity: readonly any[] | (any[])[]
}

/**
 * Custom hook that handles cached query mutation and invalidation
 *
 * @param fn - the function that is called
 * @param mutatedIdentity - the id of the query that needs to be invalidated
 *
 * @returns the mutation object
 */
const useDataMutation = <TArgs>({fn, mutatedIdentity}: Props<TArgs>) => {

    const {invalidate} = useDataQueryInvalidation();

    const mutation = useMutation(fn, {
        onSuccess: async () => {
            await invalidate(mutatedIdentity);
        }
    });

    return mutation;
}

export default useDataMutation;