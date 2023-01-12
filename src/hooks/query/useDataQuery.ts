import { useQuery } from "react-query";

interface Props {
    key: string,
    fn: any,
    fnParams: any[],
    enabled?: boolean
}

const useDataQuery = ({ key, fn, fnParams, enabled = true }: Props) => {
    const query = useQuery(
        fnParams ? [key].concat(fnParams) : [key],
        fnParams ? () => fn(...fnParams) : fn,
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            enabled
        }
    )

    return query;
}

export default useDataQuery;