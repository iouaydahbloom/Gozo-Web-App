import React from "react";
import { chainHex } from "../../helpers/networks";
import { ERC20Metadata } from "../../models/assets/ERC20Asset";

const dapContext = React.createContext<{
    walletAddress: string | null,
    chainId: string,
    defaultTokenMetadata: ERC20Metadata | null
}>({ chainId: chainHex.Fuji, defaultTokenMetadata: null, walletAddress: null });

export default dapContext;
