import {useQuery} from "react-query";
import useLoyaltyPrograms from "../useLoyaltyPrograms";
import {ProgramFilter} from "../../models/data/filter";

interface Props {
    filters: ProgramFilter
}

const useProgramsQuery = ({filters}: Props) => {

    const {fetchAllPrograms} = useLoyaltyPrograms();

    const programsQuery = useQuery(
        'programs',
        () => fetchAllPrograms(filters),
        {enabled: false}
    )

    return programsQuery;
}

export default useProgramsQuery;