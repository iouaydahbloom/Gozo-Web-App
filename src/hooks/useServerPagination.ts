import {useEffect, useState} from "react";
import {Filter} from "../models/data/filter";
import {Pagination} from "../models/data/pagination";

/**
 * Props of userServerPagination hook
 */
interface Props<T, F extends Filter> {
    /**
     * A method to getData from the server
     *
     * @param filter - the filter object to be sent to the server
     *
     * @returns a Pagination instance of specific type
     */
    getData: (filter?: F) => Promise<Pagination<T> | null>,
    /**
     * The default initial filters sent on the first server call
     */
    initialFilters?: F
}

/**
 * Custom hook that provide all server pagination data fetching handlers
 * @param Props object
 */
const useServerPagination = <T, F extends Filter>({
                                                      getData,
                                                      initialFilters
                                                  }: Props<T, F>) => {

    const [metadata, setMetadata] = useState<{ count: number, next: string, previous: string } | null>(null);
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles fetching data using the initial filters from the server
     *
     * @returns A promise that fetches the data from the server and update the hook state
     *
     * @public
     */
    async function fetchData() {
        setIsLoading(true);
        setMetadata(null);
        setData([]);
        return getData(initialFilters)
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

    /**
     * Loads more data from the server
     *
     * @public
     */
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

    /**
     * Get filters from Url search params
     *
     * @param param - the url search params
     *
     * @returns An object of dynamic filters
     */
    function getFilterFromParamProp(param: string) {
        return Object.fromEntries(new URLSearchParams(param)) as any;
    }

    /**
     * Side effects to run on the first render
     */
    useEffect(() => {
        return () => {
            setMetadata(null)
            setData([])
        }
    }, [])

    return {
        /**
         * Fetched data
         */
        data,
        /**
         * A method to fetch data from the servers
         */
        fetchData,
        /**
         * A method to load more data
         */
        loadMore,
        /**
         * Flag that indicates if more data are available
         */
        hasMore: !!metadata?.next,
        /**
         * Flag showing the fetching progress state
         */
        isLoading
    }
}

export default useServerPagination;