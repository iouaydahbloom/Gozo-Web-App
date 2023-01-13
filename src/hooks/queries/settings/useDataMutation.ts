import {useMutation, useQueryClient} from "react-query";

interface Props<TArgs> {
    fn: (args: TArgs) => Promise<any>,
    mutatedIdentity: readonly any[] | any[][]
}

const useDataMutation = <TArgs>({fn, mutatedIdentity}: Props<TArgs>) => {
    const queryClient = useQueryClient();
    const mutation = useMutation(fn, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(mutatedIdentity);
        }
    });

    return mutation;
}

export default useDataMutation;