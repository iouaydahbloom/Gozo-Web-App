import { useEffect, useState } from "react";
import { LoyaltyMemberDTO } from "../dto/loyaltyMemberDTO";
import { LoyaltyMember } from "../models/loyaltyMember";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useBlockchain from "./useBlockchain";
import useCloud from "./useCloud";

const useMemberShip = (loyaltyCurrency?: string) => {
    const [membership, setMembership] = useState<LoyaltyMember | null>(null);
    const { run } = useCloud();
    const { isInitialized } = useBlockchain();

    function fetchMembership() {
        if (!loyaltyCurrency) return;

        run(cloudFunctionName.members,
            { ca_loyalty_currency: loyaltyCurrency },
            (result: LoyaltyMemberDTO) => LoyaltyMember.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) setMembership(result.data);
            })
    }

    useEffect(() => {
        if (isInitialized) {
            fetchMembership();
        }
    }, [loyaltyCurrency, isInitialized])

    return {
        membership: membership,
        fetchMembership
    }
}

export default useMemberShip;