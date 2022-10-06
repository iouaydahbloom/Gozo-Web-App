import { useMoralis } from 'react-moralis';
import { appConfig } from '../constants/appConfig';
import { contractsAbi } from '../constants/contractsAbis';
import useBlockchainContractExecution from './useBlockchainContractExecution';
import useToast from './useToast';

const useBlockchainTransfer = (receiver: string, amount: string | number) => {

    const { Moralis } = useMoralis();
    const { execute, error, executing } = useBlockchainContractExecution();
    const { presentSuccess } = useToast();

    return {
        transfer: () => execute(
            appConfig.tokenContract,
            contractsAbi.erc20,
            'transfer',
            [receiver, amount != "" ? Moralis.Units.Token(amount) : 0],
            () => presentSuccess('Successfuly Transfered')
        ),
        error,
        executing
    }
}

export default useBlockchainTransfer;