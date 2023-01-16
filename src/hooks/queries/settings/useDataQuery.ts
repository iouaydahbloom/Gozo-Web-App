import {useQuery, UseQueryResult} from "react-query";

interface Props<TData> {
    identity: readonly any[],
    fn: () => Promise<TData>,
    enabled?: boolean
}

const useDataQuery = <TData>({identity, fn, enabled = true}: Props<TData>) => {
    const query: UseQueryResult<TData, any> = useQuery(
        identity,
        () => fn(),
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            enabled
        }
    )

    return query;
}

export default useDataQuery;