import { useMutation, useQueryClient } from "react-query";

interface Props {
    fn: any,
    mutatedQueryKey: string | string[]
}

const useDataMutation = ({ fn, mutatedQueryKey }: Props) => {
    const queryClient = useQueryClient();
    const mutation = useMutation(fn, {
        onSuccess: () => {
            if (Array.isArray(mutatedQueryKey)) {
                mutatedQueryKey.forEach(mqk => {
                    queryClient.invalidateQueries(mqk)
                })
            } else {
                queryClient.invalidateQueries(mutatedQueryKey)
            }
        }
    });

    return mutation;
}

export default useDataMutation;