import { useQuery } from "react-query";
import useLoyaltyPrograms from "../useLoyaltyPrograms";

const useUserProgramsQuery = () => {

    const { fetchMyLoyaltyPrograms } = useLoyaltyPrograms();

    const programsQuery = useQuery(
        'userPrograms',
        fetchMyLoyaltyPrograms,
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        }
    )

    return programsQuery;
}

export default useUserProgramsQuery;