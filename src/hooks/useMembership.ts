import { useEffect, useState } from "react";
import { LoyaltyMemberDTO } from "../dto/loyaltyMemberDTO";
import { LoyaltyMember } from "../models/loyaltyMember";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import useAuthentication from "./useAuthentication";
import useCloud from "./useCloud";

const useMemberShip = (loyaltyCurrency?: string) => {

    const [membership, setMembership] = useState<LoyaltyMember | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { run } = useCloud();
    const { isAuthenticated } = useAuthentication();

    async function fetchMembership(): Promise<any> {
        if (!loyaltyCurrency || !isAuthenticated) return Promise.resolve(null);
        setIsLoading(true);
        return run(cloudFunctionName.members,
            { ca_loyalty_currency: loyaltyCurrency },
            (result: LoyaltyMemberDTO) => LoyaltyMember.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) setMembership(result.data);
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchMembership();
        }

        return () => {
            setMembership(null)
        }
    }, [loyaltyCurrency])

    return {
        isLoading,
        membership: membership,
        fetchMembership
    }
}

export default useMemberShip;