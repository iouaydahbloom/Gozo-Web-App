import { useEffect, useState } from "react";
import { LoyaltyMemberDTO } from "../dto/loyaltyMemberDTO";
import { LoyaltyMember } from "../models/loyaltyMember";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";

const useMemberShip = (loyaltyCurrency?: string) => {
    const [membership, setMembership] = useState<LoyaltyMember>();
    const { run } = useCloud();

    useEffect(() => {
        if (!loyaltyCurrency) return;

        run(cloudFunctionName.members,
            { ca_loyalty_currency: loyaltyCurrency },
            (result: LoyaltyMemberDTO) => LoyaltyMember.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) setMembership(result.data);
            })
    }, [loyaltyCurrency])

    return {
        membership: membership
    }
}

export default useMemberShip;