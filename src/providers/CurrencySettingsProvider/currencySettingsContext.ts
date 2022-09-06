import { UserLoyaltyProgram } from "../../models/loyaltyProgram";
import React from 'react';
import { LoyaltyMember } from "../../models/loyaltyMember";
import { ERC20Asset } from "../../models/assets/ERC20Asset";

const currencySettingsContext = React.createContext<{
    gozoLoyalty: UserLoyaltyProgram | null,
    gozoLoyaltyMembership: LoyaltyMember | null,
    fetchGozoLoyaltyMembership: () => void,
    gozoToken: ERC20Asset | null,
    fetchToken: () => void
}>({
    gozoLoyalty: null,
    gozoLoyaltyMembership: null,
    fetchGozoLoyaltyMembership: () => null,
    gozoToken: null,
    fetchToken: () => null
})

export { currencySettingsContext }