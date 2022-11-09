import { useEffect, useState } from "react";
import useAuthentication from "../../hooks/useAuthentication";
import useDefaultCurrency from "../../hooks/useDefaultCurrency";
import useERC20Assets from "../../hooks/useERC20Assets";
import useMemberShip from "../../hooks/useMembership";
import { UserLoyaltyProgram } from "../../models/loyaltyProgram";
import { currencySettingsContext } from "./currencySettingsContext";

const CurrencySettingsProvider: React.FC = ({ children }) => {

    const [gozoLoyalty, setGozoLoyalty] = useState<UserLoyaltyProgram | null>(null);
    const { membership, fetchMembership } = useMemberShip('GZL_LVXMS');
    const { defaultAsset, fetchERC20Assets } = useERC20Assets();
    const { isAuthenticated } = useAuthentication();
    const {fetchDefaultCurrency} = useDefaultCurrency();

    useEffect(() => {
        if (isAuthenticated) {
            fetchERC20Assets();
            fetchMembership();
            fetchDefaultCurrency().then((res) => {
                setGozoLoyalty(res)
            })
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