import { useEffect, useState } from "react";
import { LoyaltyMemberDTO } from "../dto/loyaltyMemberDTO";
import { LoyaltyMember } from "../models/loyaltyMember";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";

const useMemberShip = (loyaltyCurrency?: string) => {
    const [membership, setMembership] = useState<LoyaltyMember | null>(null);
    const { run } = useCloud();

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
        fetchMembership();
    }, [loyaltyCurrency])

    return {
        membership: membership,
        fetchMembership
    }
}

export default useMemberShip;