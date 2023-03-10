import React from "react";
import { chainHex } from "../../helpers/networks";
import { ERC20Metadata } from "../../models/assets/ERC20Asset";
import { NativeAsset } from "../../models/assets/NativeAsset";
import { CommonContextProp } from "../CommonContextProp";

interface Prop extends CommonContextProp, ContractsMetadata {
    walletAddress: string | null,
    chainId: string,
    defaultTokenMetadata: ERC20Metadata | null,
    defaultNativeMetada: NativeAsset | null
}

export interface ContractsMetadata {
    tokenContractAddress: string,
    gameContractAddress: string,
    relayerContractAddress: string,
    forwarderContractAddress: string,
    tokenContractAbi: any[],
    gameContractAbi: any[],
    forwarderContractAbi: any[],
    botWalletAddress: string
}

const dappContext = React.createContext<Prop>({
    chainId: chainHex.Fuji,
    defaultTokenMetadata: null,
    defaultNativeMetada: null,
    walletAddress: null,
    tokenContractAddress: '',
    gameContractAddress: '',
    relayerContractAddress: '',
    forwarderContractAddress: '',
    tokenContractAbi: [],
    gameContractAbi: [],
    forwarderContractAbi: [],
    botWalletAddress: '',
    isReady: false,
    refresh: () => Promise.resolve()
});

export default dappContext;
