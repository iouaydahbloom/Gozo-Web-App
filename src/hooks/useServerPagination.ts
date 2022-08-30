import { useEffect, useState } from "react";
import { Filter } from "../models/data/filter";
import { Pagination } from "../models/data/pagination";

interface Props<T> {
    getData: (filter: Filter) => Promise<Pagination<T>>
}

const useServerPagination = <T>({ getData }: Props<T>) => {

    const [metadata, setMetadata] = useState<{ count: number, next: string, previous: string } | null>(null);
    const [data, setData] = useState<T[]>([]);

    useEffect(() => {
        getData({ page: 1, page_size: 30 })
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
        return new Filter(parseInt(page), parseInt(pageSize))
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