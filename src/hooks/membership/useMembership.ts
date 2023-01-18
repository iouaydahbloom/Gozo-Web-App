import {LoyaltyMemberDTO} from "../../dto/loyaltyMemberDTO";
import {LoyaltyMember} from "../../models/loyaltyMember";
import {cloudFunctionName} from "../../constants/cloudFunctionName";
import useAuthentication from "../useAuthentication";
import useCloud from "../useCloud";
import useDataQuery from "../queryCaching/useDataQuery";
import {membershipQueriesIdentity} from "./membershipQueriesIdentity";

const useMemberShip = (loyaltyCurrency?: string) => {

    const {run} = useCloud();
    const {isAuthenticated} = useAuthentication();

    const membershipQuery = useDataQuery({
        identity: membershipQueriesIdentity.info(loyaltyCurrency),
        fn: () => getMembership(loyaltyCurrency),
        enabled: isAuthenticated
    });

    async function getMembership(loyaltyCurrency?: string) {
        if (!loyaltyCurrency || !isAuthenticated) return Promise.resolve(null);
        return run(cloudFunctionName.members,
            {ca_loyalty_currency: loyaltyCurrency},
            (result: LoyaltyMemberDTO) => LoyaltyMember.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) return result.data;
                return null;
            })
    }

    return {
        isLoading: membershipQuery.isLoading,
        membership: membershipQuery.data,
        fetchMembership: membershipQuery.refetch
    }
}

export default useMemberShip;