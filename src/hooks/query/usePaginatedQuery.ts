import {useQuery} from "react-query";
import {Filter} from "../../models/data/filter";
import {Pagination} from "../../models/data/pagination";

interface Props<FilterType extends Filter, DataType> {
    key: string,
    fn: (filter?: FilterType) => Promise<Pagination<DataType> | null>,
    filter?: FilterType
}

const usePaginatedQuery = <FilterType extends Filter, DataType>({key, fn, filter}: Props<FilterType, DataType>) => {
    const query = useQuery(
        [key, filter],
        () => {
            return fn(filter)
        },
        {
            //enabled: false,
            refetchOnWindowFocus: false,
            keepPreviousData: true
        }
    );

    return query;
}

export default usePaginatedQuery;