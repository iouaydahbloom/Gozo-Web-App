import {useEffect, useState} from "react";
import {Filter} from "../models/data/filter";
import {Pagination} from "../models/data/pagination";
import usePaginatedQuery from "./query/usePaginatedQuery";

interface Props<DataType, FilterType extends Filter> {
    id?: string,
    getData: (filter?: FilterType) => Promise<Pagination<DataType> | null>,
    initialFilter?: FilterType
}

const useServerPagination = <DataType, FilterType extends Filter>({
                                                                      id,
                                                                      getData,
                                                                      initialFilter
                                                                  }: Props<DataType, FilterType>) => {

    const [metadata, setMetadata] = useState<{ count: number, next: string, previous: string } | null>(null);
    const [filter, setFilter] = useState(initialFilter);
    const paginatedQuery = usePaginatedQuery({
        filter: filter,
        fn: getData,
        key: id ?? ''
    });

    function getFilterFromParamProp(param: string) {
        return Object.fromEntries(new URLSearchParams(param)) as any;
    }

    function loadMore() {
        if (!metadata || !metadata.next) return;
        setFilter(getFilterFromParamProp(metadata.next));
    }

    useEffect(() => {
        if (paginatedQuery.data) {
            const result = paginatedQuery.data;
            setMetadata({
                count: result.count,
                next: result.next,
                previous: result.previous
            });
        }
    }, [paginatedQuery.data])

    useEffect(() => {
        return () => {
            setMetadata(null)
        }
    }, [])

    return {
        data: paginatedQuery.data?.results ?? [],
        isLoading: paginatedQuery.isLoading,
        hasMore: !!metadata?.next,
        loadMore,
        fetchData: paginatedQuery.refetch
    }
}

export default useServerPagination;