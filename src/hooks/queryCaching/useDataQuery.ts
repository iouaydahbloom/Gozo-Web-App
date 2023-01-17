import {useQuery, UseQueryResult} from "react-query";

interface Props<TData> {
    identity: readonly any[],
    fn: () => Promise<TData>,
    enabled?: boolean
}

/**
 * Custom hook that handles caching promises responses (mostly http requests)
 *
 * @param identity - the id of the cached results
 * @param fn - the function that will be cached
 * @param enabled - flag to set the automatic initiation of the query
 *
 * @returns the query object
 */
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