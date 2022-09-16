import { useMoralis } from 'react-moralis';
import { appConfig } from '../constants/appConfig';
import { contractsAbi } from '../constants/contractsAbis';
import useBlockchainContractExecution from './useBlockchainContractExecution';

const useBlockchainTransfer = (receiver: string, amount: string | number) => {

    const { Moralis } = useMoralis()

    const { run, error, executing } = useBlockchainContractExecution({
        contractAddress: appConfig.tokenContract,
        abi: contractsAbi.erc20,
        funct: 'transfer',
        params: [receiver, amount != "" ? Moralis.Units.Token(amount) : 0],
    });

    return {
        transfer: run,
        error,
        executing
    }
}

export default useBlockchainTransfer;