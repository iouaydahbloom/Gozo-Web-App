import {useEffect, useState} from "react";
import {LoyaltyMember} from "../../models/loyaltyMember";
import useAuthentication from "../useAuthentication";
import {act} from "@testing-library/react";

const useMembership = (loyaltyCurrency?: string) => {

    const [membership, setMembership] = useState<LoyaltyMember | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {isAuthenticated} = useAuthentication();

    async function fetchMembership(): Promise<any> {
        if (!loyaltyCurrency || !isAuthenticated) return Promise.resolve(null);

        const membership = new LoyaltyMember('',
            '',
            '',
            '',
            1000,
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            loyaltyCurrency,
            '',
            '',
            '',
            '',
            ''
        );

        setIsLoading(true);
        return Promise
            .resolve(membership)
            .then(result => {
                act(() => setMembership(result))
            })
            .finally(() => {
                act(() => setIsLoading(false))
            })
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

export default useMembership;