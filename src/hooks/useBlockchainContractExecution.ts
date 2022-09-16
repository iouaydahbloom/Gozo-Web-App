import useMagicAuth from "./useMagicAuth";
import { ethers } from 'ethers';
import { useState } from "react";

interface Props {
    contractAddress: string,
    abi: any,
    funct: string,
    params: any[]
}

const useBlockchainContractExecution = ({ contractAddress, abi, funct, params }: Props) => {

    const { getProviderSigner } = useMagicAuth();
    const [error, setError] = useState();
    const [executing, setExecuting] = useState(false);

    async function run() {
        try {
            setExecuting(true);
            const contract = new ethers.Contract(contractAddress, abi, getProviderSigner());
            let gasLimit = await contract.estimateGas[funct](...params);
            // Send transaction to smart contract to update message
            const tx = await contract[funct](...params, { gasLimit: gasLimit, gasPrice: 25000000000 });
            // Wait for transaction to finish
            const receipt = await tx.wait();
            setExecuting(false);
            return receipt;
        }
        catch (error: any) {
            setError(error)
        }
        setExecuting(false);
    }

    return {
        run,
        error,
        executing
    }
}

export default useBlockchainContractExecution;