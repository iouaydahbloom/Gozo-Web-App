import {useMutation, useQueryClient} from "react-query";

interface Props<TArgs> {
    fn: (args: TArgs) => Promise<any>,
    mutatedIdentity: readonly any[] | (any[])[]
}

const useDataMutation = <TArgs>({fn, mutatedIdentity}: Props<TArgs>) => {
    const queryClient = useQueryClient();
    const mutation = useMutation(fn, {
        onSuccess: async () => {
            if(mutatedIdentity.length === 0) return;

            if(Array.isArray(mutatedIdentity[0])) {
                return Promise.all(mutatedIdentity.map(m => (
                    queryClient.invalidateQueries(m)
                )))
            }

            return queryClient.invalidateQueries(mutatedIdentity);
        }
    });

    return mutation;
}

export default useDataMutation;