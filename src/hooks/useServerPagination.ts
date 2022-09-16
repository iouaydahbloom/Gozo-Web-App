import { useEffect, useState } from "react";
import { Filter } from "../models/data/filter";
import { Pagination } from "../models/data/pagination";

interface Props<T, F extends Filter> {
    getData: (filter: F) => Promise<Pagination<T>>,
    intialFilters?: F
}

const useServerPagination = <T, F extends Filter>({
    getData,
    intialFilters = new Filter(1, 100) as any
}: Props<T, F>) => {

    const [metadata, setMetadata] = useState<{ count: number, next: string, previous: string } | null>(null);
    const [data, setData] = useState<T[]>([]);

    useEffect(() => {
        getData(intialFilters)
            .then(result => {
                setMetadata({
                    count: result.count,
                    next: result.next,
                    previous: result.previous
                });
                setData(result.results as any[]);
            })
    }, [])

    function getFilterFromParamProp(param: string) {
        const page = param.match(/\d+/g)![0];
        const pageSize = param.match(/\d+/g)![1];
        return new Filter(parseInt(page), parseInt(pageSize)) as any
    }

    function loadMore() {
        if (!metadata || !metadata.next) return;
        getData(getFilterFromParamProp(metadata.next))
            .then(result => {
                setMetadata({
                    count: result.count,
                    next: result.next,
                    previous: result.previous
                });
                setData([...data, ...result.results]);
            })
    }

    return {
        data: data,
        loadMore: loadMore,
        hasMore: !!metadata?.next
    }
}

export default useServerPagination;