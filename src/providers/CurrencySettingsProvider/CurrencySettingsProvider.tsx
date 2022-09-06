import { useEffect, useState } from "react";
import useERC20Assets from "../../hooks/useERC20Assets";
import useMemberShip from "../../hooks/useMembership";
import { UserLoyaltyProgram } from "../../models/loyaltyProgram";
import { currencySettingsContext } from "./currencySettingsContext";

const CurrencySettingsProvider: React.FC = ({ children }) => {

    const [gozoLoyalty, setGozoLoyalty] = useState<UserLoyaltyProgram | null>(null);
    const { membership, fetchMembership } = useMemberShip(gozoLoyalty?.currency?.loyaltyCurrency);
    const { defaultAsset, fetchERC20Assets } = useERC20Assets();

    useEffect(() => {
        setGozoLoyalty(UserLoyaltyProgram.getFromDefaultCurrencyDTO({
            curency_display_name: 'GZL',
            currency_id: 'GZL_LVXMS'
        }))
    }, [])

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