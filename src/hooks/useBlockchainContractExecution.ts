import useMagicAuth from "./useMagicAuth";
import { ethers } from 'ethers';

interface Props {
    contractAddress: string,
    abi: any,
    funct: string,
    params: any[],
    isReadOnly?: boolean
}

const useBlockchainContractExecution = ({ contractAddress, abi, funct, params, isReadOnly = true }: Props) => {
    const { getProviderSigner } = useMagicAuth();

    async function run() {
        debugger
        const contract = new ethers.Contract(contractAddress, abi, getProviderSigner());
        // Send transaction to smart contract to update message
        const tx = await contract[funct](...params);
        // Wait for transaction to finish
        const receipt = await tx.wait();

        return receipt;
    }

    return { run }
}

export default useBlockchainContractExecution;