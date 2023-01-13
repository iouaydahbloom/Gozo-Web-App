//import { useEffect, useState } from "react";
import useAuthentication from "../../hooks/useAuthentication";
import useCryptoAssets from "../../hooks/cryptoAssets/useCryptoAssets";
import useLoyaltyPrograms from "../../hooks/loyaltyProgram/useLoyaltyPrograms";
import useMemberShip from "../../hooks/membership/useMembership";
import {UserLoyaltyProgram} from "../../models/loyaltyProgram";
import {currencySettingsContext} from "./currencySettingsContext";
import useDataQuery from "../../hooks/queries/settings/useDataQuery";
import {LoyaltyMember} from "../../models/loyaltyMember";

const CurrencySettingsProvider: React.FC = ({children}) => {

    //const [gozoLoyalty, setGozoLoyalty] = useState<UserLoyaltyProgram | null>(null);
    const {membership, fetchMembership} = useMemberShip('GZL_LVXMS');
    const {defaultERC20Asset, fetchCryptoAssets} = useCryptoAssets();
    const {isAuthenticated} = useAuthentication();
    const {fetchDefaultCurrency} = useLoyaltyPrograms();

    const defaultCurrencyQuery = useDataQuery({
        key: 'defaultCurrency',
        fn: fetchDefaultCurrency,
        enabled: isAuthenticated
    });

    // useEffect(() => {
    //     if (isAuthenticated) {
    //         fetchDefaultCurrency().then((res) => {
    //             setGozoLoyalty(res)
    //         })
    //     }
    // }, [isAuthenticated])

    return (
        <currencySettingsContext.Provider value={{
            gozoLoyalty: defaultCurrencyQuery.data as UserLoyaltyProgram,
            gozoLoyaltyMembership: membership as LoyaltyMember,
            fetchGozoLoyaltyMembership: fetchMembership,
            gozoToken: defaultERC20Asset,
            fetchToken: fetchCryptoAssets
        }}>
            {children}
        </currencySettingsContext.Provider>
    )
}

export default CurrencySettingsProvider;