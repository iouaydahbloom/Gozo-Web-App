import { UserLoyaltyProgram } from "../../models/loyaltyProgram";
import React from 'react';
import { LoyaltyMember } from "../../models/loyaltyMember";
import { ERC20Asset } from "../../models/assets/ERC20Asset";

const currencySettingsContext = React.createContext<{
    gozoLoyalty: UserLoyaltyProgram | null,
    gozoLoyaltyMembership: LoyaltyMember | null,
    fetchGozoLoyaltyMembership: () => Promise<any>,
    gozoToken: ERC20Asset | null,
    fetchToken: () => Promise<any>
}>({
    gozoLoyalty: null,
    gozoLoyaltyMembership: null,
    fetchGozoLoyaltyMembership: () => Promise.resolve(),
    gozoToken: null,
    fetchToken: () => Promise.resolve()
})

export { currencySettingsContext }