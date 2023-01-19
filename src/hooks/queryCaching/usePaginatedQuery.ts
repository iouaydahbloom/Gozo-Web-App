import {useInfiniteQuery} from "react-query";
import {Filter} from "../../models/data/filter";

interface Props<TFilter extends Filter, TData> {
    identity: any[],
    getData: (filter: TFilter) => Promise<TData>,
    initialFilter?: TFilter
}

/**
 * Custom hook that handles paginated query results
 *
 * @param identity - the id of the query result
 * @param getData - the function to fetch data from server
 * @param initialFilter - the default filtering param
 *
 * @returns the paginated query object
 */
const usePaginatedQuery = <TFilter extends Filter, TData>({
                                                              identity,
                                                              getData,
                                                              initialFilter = new Filter(1, 10) as any
                                                          }: Props<TFilter, TData>) => {

    const paginatedQuery = useInfiniteQuery({
        queryKey: identity,
        queryFn: ({pageParam}) => {
            return getData(pageParam ?? initialFilter)
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
        refetch: () =>
            paginatedQuery.refetch({refetchPage: (page, index) => index === 0})
    }
}

export default usePaginatedQuery;