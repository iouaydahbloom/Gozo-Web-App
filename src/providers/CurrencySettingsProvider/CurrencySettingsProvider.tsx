import useCryptoAssets from "../../hooks/cryptoAssets/useCryptoAssets";
import useMemberShip from "../../hooks/membership/useMembership";
import {UserLoyaltyProgram} from "../../models/loyaltyProgram";
import {currencySettingsContext} from "./currencySettingsContext";
import useDataQuery from "../../hooks/queryCaching/useDataQuery";
import {LoyaltyMember} from "../../models/loyaltyMember";
import React from "react";
import {cloudFunctionName} from "../../constants/cloudFunctionName";
import {DefaultCurrencyDTO} from "../../dto/defaultCurrencyDTO";
import useCloud from "../../hooks/useCloud";

const CurrencySettingsProvider: React.FC = ({children}) => {

    const {membership, fetchMembership} = useMemberShip('GZL_LVXMS');
    const {defaultERC20Asset, fetchCryptoAssets} = useCryptoAssets();
    const {run} = useCloud();
    const defaultCurrencyQuery = useDataQuery({
        identity: ['defaultCurrency'],
        fn: fetchDefaultCurrency
    })

    async function fetchDefaultCurrency() {
        return run(cloudFunctionName.defaultCurrency,
            null,
            (result: DefaultCurrencyDTO) => UserLoyaltyProgram.getFromDefaultCurrencyDTO(result),
            true)
            .then(result => {
                return result.isSuccess ? result.data : null
            })
    }

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