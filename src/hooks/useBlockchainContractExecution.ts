import useBlockchain from "./useBlockchain";

interface Props {
    contractAddress: string,
    abi: any,
    funct: string,
    params: any,
    isReadOnly?: boolean
}

const useBlockchainContractExecution = ({ contractAddress, abi, funct, params, isReadOnly = true }: Props) => {
    const { helpers, ensureWeb3Enabled } = useBlockchain();

    const run = async () => {
        if (!isReadOnly) {
            await ensureWeb3Enabled();
        }

        return helpers.executeFunction({
            abi: abi,
            contractAddress: contractAddress,
            functionName: funct,
            params: params
        })
    }

    return { run }
}

export default useBlockchainContractExecution;