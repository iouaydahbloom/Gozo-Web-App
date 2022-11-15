import React from "react";
import { chainHex } from "../../helpers/networks";
import { ERC20Metadata } from "../../models/assets/ERC20Asset";
import { WaitableContextProp } from "../waitableContextProp";

interface Prop extends WaitableContextProp, ContractsMetadata {
    walletAddress: string | null,
    chainId: string,
    defaultTokenMetadata: ERC20Metadata | null,
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

const dapContext = React.createContext<Prop>({
    chainId: chainHex.Fuji,
    defaultTokenMetadata: null,
    walletAddress: null,
    isReady: false,
    tokenContractAddress: '',
    gameContractAddress: '',
    relayerContractAddress: '',
    forwarderContractAddress: '',
    tokenContractAbi: [],
    gameContractAbi: [],
    forwarderContractAbi: [],
    botWalletAddress: ''
});

export default dapContext;
