import { ethers } from "ethers";

export function parseBlockchainValue(value: string | number) {
    return ethers.utils.parseEther(value.toString()).toString();
}

export function parseNumber(blockchainValue: string | number) {
    return ethers.utils.formatEther(blockchainValue.toString());
}