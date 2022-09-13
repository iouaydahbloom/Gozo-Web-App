import { useEffect, useState } from "react";
import useAuthentication from "../../hooks/useAuthentication";
import useERC20Assets from "../../hooks/useERC20Assets";
import useMemberShip from "../../hooks/useMembership";
import { UserLoyaltyProgram } from "../../models/loyaltyProgram";
import { currencySettingsContext } from "./currencySettingsContext";

const CurrencySettingsProvider: React.FC = ({ children }) => {

    const [gozoLoyalty] = useState<UserLoyaltyProgram | null>(UserLoyaltyProgram.getFromDefaultCurrencyDTO({
        curency_display_name: 'GZL',
        currency_id: 'GZL_LVXMS'
    }));
    const { membership, fetchMembership } = useMemberShip('GZL_LVXMS');
    const { defaultAsset, fetchERC20Assets } = useERC20Assets();
    const { isAuthenticated } = useAuthentication();

    useEffect(() => {
        if (isAuthenticated) {
            fetchERC20Assets();
            fetchMembership();
        }
    }, [isAuthenticated])

    return (
        <currencySettingsContext.Provider value={{
            gozoLoyalty: gozoLoyalty,
            gozoLoyaltyMembership: membership,
            fetchGozoLoyaltyMembership: fetchMembership,
            gozoToken: defaultAsset,
            fetchToken: fetchERC20Assets
        }}>
            {children}
        </currencySettingsContext.Provider>
    )
}

export default CurrencySettingsProvider;