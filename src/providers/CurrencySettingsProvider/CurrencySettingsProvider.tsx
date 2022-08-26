import { useEffect, useState } from "react";
import { UserLoyaltyProgram } from "../../models/loyaltyProgram";
import { currencySettingsContext } from "./currencySettingsContext";

const CurrencySettingsProvider: React.FC = ({ children }) => {

    const [gozoLoyalty, setGozoLoyalty] = useState<UserLoyaltyProgram | null>(null);

    useEffect(() => {
        setGozoLoyalty(UserLoyaltyProgram.getFromDefaultCurrencyDTO({
            curency_display_name: 'GZL',
            currency_id: 'GZL_LVXMS'
        }))
    }, [])

    return (
        <currencySettingsContext.Provider value={{ gozoLoyalty: gozoLoyalty }}>
            {children}
        </currencySettingsContext.Provider>
    )
}

export default CurrencySettingsProvider;