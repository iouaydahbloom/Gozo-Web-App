import { useEffect, useState } from "react";
import { LoyaltyMemberDTO } from "../dto/loyaltyMemberDTO";
import { LoyaltyMember } from "../models/loyaltyMember";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import useAuthentication from "./useAuthentication";
import useCloud from "./useCloud";
import useDataQuery from "./query/useDataQuery";

const useMemberShip = (loyaltyCurrency?: string) => {

    //const [membership, setMembership] = useState<LoyaltyMember | null>(null);
    //const [isLoading, setIsLoading] = useState(false);
    const { run } = useCloud();
    const { isAuthenticated } = useAuthentication();
    const membershipQuery = useDataQuery({
        key: 'membership',
        fn: getMembership,
        fnParams: [loyaltyCurrency],
        enabled: isAuthenticated
    });

    async function getMembership(loyaltyCurrency: string) {
        if (!loyaltyCurrency || !isAuthenticated) return Promise.resolve(null);
        return run(cloudFunctionName.members,
            { ca_loyalty_currency: loyaltyCurrency },
            (result: LoyaltyMemberDTO) => LoyaltyMember.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) return result.data;
                return null;
            })
    }

    // async function fetchMembership(): Promise<any> {
    //     if (!loyaltyCurrency || !isAuthenticated) return Promise.resolve(null);
    //     setIsLoading(true);
    //     return run(cloudFunctionName.members,
    //         { ca_loyalty_currency: loyaltyCurrency },
    //         (result: LoyaltyMemberDTO) => LoyaltyMember.getFromDTO(result),
    //         true)
    //         .then(result => {
    //             if (result.isSuccess) setMembership(result.data);
    //         })
    //         .finally(() => setIsLoading(false))
    // }

    // useEffect(() => {
    //     if (isAuthenticated) {
    //         fetchMembership();
    //     }

    //     return () => {
    //         setMembership(null)
    //     }
    // }, [loyaltyCurrency])

    return {
        isLoading: membershipQuery.isLoading,
        membership: membershipQuery.data as LoyaltyMember | null,
        fetchMembership: membershipQuery.refetch
    }
}

export default useMemberShip;