import { useInfiniteQuery } from "react-query";
import { Filter } from "../../models/data/filter";
import { Pagination } from "../../models/data/pagination";

interface Props<TFilter extends Filter, TData> {
    identity: any[],
    getData: (filter: TFilter, otherParams?: any) => Promise<Pagination<TData> | null>,
    otherParams?: any
}

/**
 * Custom hook that handles paginated query results
 *
 * @param identity - the id of the query result
 * @param getData - the function to fetch data from server
 *
 * @returns the paginated query object
 */
const usePaginatedQuery = <TFilter extends Filter, TData>({
    identity,
    getData,
    otherParams
}: Props<TFilter, TData>) => {

    const paginatedQuery = useInfiniteQuery({
        queryKey: identity,
        queryFn: ({ pageParam }) => {
            return getData(pageParam, otherParams)
        },
        getNextPageParam: (lastPage: any) => {
            return lastPage.next ? getFilterFromParamProp(lastPage.next) : undefined
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });

    function getFilterFromParamProp(param: string) {
        return Object.fromEntries(new URLSearchParams(param)) as any;
    }

    return {
        ...paginatedQuery,
        data: paginatedQuery.data?.pages.map(page => page?.results).flat(1),
        refetch: () => paginatedQuery.refetch({ refetchPage: (page, index) => index === 0 })
    }
}

export default usePaginatedQuery;