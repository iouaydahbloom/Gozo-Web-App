import { useEffect, useState } from "react";
import useAuthentication from "../../hooks/useAuthentication";
import useCryptoAssets from "../../hooks/useCryptoAssets";
import useLoyaltyPrograms from "../../hooks/useLoyaltyPrograms";
import useMemberShip from "../../hooks/useMembership";
import { UserLoyaltyProgram } from "../../models/loyaltyProgram";
import { currencySettingsContext } from "./currencySettingsContext";

const CurrencySettingsProvider: React.FC = ({ children }) => {

    const [gozoLoyalty, setGozoLoyalty] = useState<UserLoyaltyProgram | null>(null);
    const { membership, fetchMembership } = useMemberShip('GZL_LVXMS');
    const { defaultERC20Asset, fetchCryptoAssets } = useCryptoAssets();
    const { isAuthenticated } = useAuthentication();
    const { fetchDefaultCurrency } = useLoyaltyPrograms();

    useEffect(() => {
        if (isAuthenticated) {
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
            gozoToken: defaultERC20Asset,
            fetchToken: fetchCryptoAssets
        }}>
            {children}
        </currencySettingsContext.Provider>
    )
}

export default CurrencySettingsProvider;