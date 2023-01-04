import { useEffect, useState } from "react";
import { LoyaltyMember } from "../../models/loyaltyMember";
import useAuthentication from "../useAuthentication/useAuthentication";

const useMemberShipMock = (loyaltyCurrency?: string) => {

    const [membership, setMembership] = useState<LoyaltyMember | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuthentication();

    async function fetchMembership(): Promise<any> {
        if (!loyaltyCurrency || !isAuthenticated) return Promise.resolve(null);
        const membership = new LoyaltyMember('', '', '', '', 1000, '', '', '', '', '', '', '', '', loyaltyCurrency, '', '', '', '', '');
        setIsLoading(true);
        return Promise.resolve(membership)
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

export default useMemberShipMock;