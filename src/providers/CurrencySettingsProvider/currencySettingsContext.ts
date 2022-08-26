import { UserLoyaltyProgram } from "../../models/loyaltyProgram";
import React from 'react';

const currencySettingsContext = React.createContext<{ gozoLoyalty: UserLoyaltyProgram | null }>({ gozoLoyalty: null });

export { currencySettingsContext }