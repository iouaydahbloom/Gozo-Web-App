import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { LoyaltyMemberDTO } from "../dto/loyaltyMemberDTO";
import { LoyaltyMember } from "../models/loyaltyMember";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useAuthentication from "./useAuthentication";
import useCloud from "./useCloud";

const useMemberShip = (loyaltyCurrency?: string) => {
    const [membership, setMembership] = useState<LoyaltyMember | null>(null);
    const { run } = useCloud();
    const { isInitialized } = useMoralis();
    const { isAuthenticated } = useAuthentication();

    async function fetchMembership(): Promise<any> {
        if (!loyaltyCurrency || !isAuthenticated) return Promise.resolve(null);
        return run(cloudFunctionName.members,
            { ca_loyalty_currency: loyaltyCurrency },
            (result: LoyaltyMemberDTO) => LoyaltyMember.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) setMembership(result.data);
            })
    }

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            fetchMembership();
        }
    }, [loyaltyCurrency, isInitialized])

    return {
        membership: membership,
        fetchMembership
    }
}

export default useMemberShip;