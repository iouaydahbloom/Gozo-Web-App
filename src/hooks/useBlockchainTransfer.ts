import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { appConfig } from '../constants/appConfig';
import { contractsAbi } from '../constants/contractsAbis';
import { useDapp } from '../providers/DappProvider/DappProvider';
import useBlockchainContractExecution from './useBlockchainContractExecution';
import useToast from './useToast';

const useBlockchainTransfer = (receiver: string, amount: string | number) => {

    const { Moralis } = useMoralis();
    const { execute, estimate, executing } = useBlockchainContractExecution();
    const { presentSuccess, presentFailure } = useToast();
    const [transferFee, setTransferFee] = useState<number>();
    const [isEstimatingTransferFee, setIsEstimatingTransferFee] = useState(false);
    const { walletAddress } = useDapp();

    useEffect(() => {
        setIsEstimatingTransferFee(true);
        estimate(
            appConfig.tokenContract,
            contractsAbi.erc20,
            'transfer',
            [walletAddress, 0]
        )
            .then(fee => {
                setTransferFee(fee);
            })
            .catch(error => {
                presentFailure(error.message);
            })
            .finally(() => {
                setIsEstimatingTransferFee(false);
            });
    }, [])

    return {
        transfer: () => execute(
            appConfig.tokenContract,
            contractsAbi.erc20,
            'transfer',
            [receiver, amount != "" ? Moralis.Units.Token(amount) : 0],
            () => presentSuccess('Successfully Transfered'),
            (error) => presentFailure(error.message)
        ),
        isEstimatingTransferFee,
        transferFee,
        executing
    }
}

export default useBlockchainTransfer;