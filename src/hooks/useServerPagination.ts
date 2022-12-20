import { useEffect, useState } from "react";
import { Filter } from "../models/data/filter";
import { Pagination } from "../models/data/pagination";

interface Props<T, F extends Filter> {
    getData: (filter: F) => Promise<Pagination<T> | null>,
    intialFilters?: F
}

const useServerPagination = <T, F extends Filter>({
    getData,
    intialFilters = new Filter(1, 10) as any
}: Props<T, F>) => {

    const [metadata, setMetadata] = useState<{ count: number, next: string, previous: string } | null>(null);
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function fetchData() {
        setIsLoading(true);
        setMetadata(null)
        setData([])
        return getData(intialFilters)
            .then(result => {
                if (!result) return;

                setMetadata({
                    count: result.count,
                    next: result.next,
                    previous: result.previous
                });
                setData(result.results as any[]);
            })
            .finally(() => setIsLoading(false))
    }

    function getFilterFromParamProp(param: string) {
        return Object.fromEntries(new URLSearchParams(param)) as any;
    }

    function loadMore() {
        if (!metadata || !metadata.next) return;
        if (data.length === 0) setIsLoading(true);
        getData(getFilterFromParamProp(metadata.next))
            .then(result => {
                if (!result) return;

                setMetadata({
                    count: result.count,
                    next: result.next,
                    previous: result.previous
                });
                setData([...data, ...result.results]);
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        return () => {
            setMetadata(null)
            setData([])
        }
    }, [])

    return {
        data: data,
        isLoading,
        loadMore: loadMore,
        hasMore: !!metadata?.next,
        fetchData
    }
}

export default useServerPagination;