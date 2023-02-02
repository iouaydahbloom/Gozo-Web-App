import { useCallback, useEffect, useState } from 'react';
import { useDapp } from '../providers/DappProvider/DappProvider';
import useBlockchainContractExecution from './useBlockchainContractExecution';
import useToast from './useToast';
import { ethers } from 'ethers';
import { parseBlockchainValue } from '../helpers/blockchainHelper';
import { SwapPartyType } from './useTokenToOthersExchange';

const useBlockchainTransfer = () => {

    const { execute, estimate, executing, signer } = useBlockchainContractExecution();
    const { presentSuccess } = useToast();
    const [transferFee, setTransferFee] = useState<number>();
    const [isEstimatingTransferFee, setIsEstimatingTransferFee] = useState(false);
    const { walletAddress, tokenContractAddress, tokenContractAbi } = useDapp();
    const [error, setError] = useState<Error>();

    function getTransferDefaultMessage(fees: number, amount: string | number) {
        return `An amount of ${(fees + parseFloat(amount as string)).toString()} GZ tokens will 
        be reduced from your wallet, if you are not holding this amount you can't achieve this transaction,
        Are you sure you want to continue ?`
    }

    const transferNative = useCallback(async (recipient: string, amount: number) => {
        try {
            const tx = await signer.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(amount.toString()),
                gasPrice: 26000000000,
                gasLimit: 21000
            });
            const receipt = await tx.wait();
            if (receipt.status) return true;
            throw new Error();
        }
        catch (error: any) {
            console.log('Native transfer error is ', error);
            setError(new Error('Insufficent funds or transaction inner failure'));
            return false;
        }
    }, [])

    const transferToken = useCallback((receiver: string, amount: string | number) => execute(
        tokenContractAddress,
        tokenContractAbi,
        'transfer',
        [receiver, amount !== "" ? parseBlockchainValue(amount) : 0],
        () => presentSuccess('Successfully Transfered'),
        setError,
        (fees) => getTransferDefaultMessage(fees, amount)
    ), [])

    const transferTokensToOwner = useCallback((
        amount: string | number,
        type: SwapPartyType,
        onSuccess: () => any,
        onError: (error: any) => any) => execute(
            tokenContractAddress,
            tokenContractAbi,
            'transferToOwner',
            [parseBlockchainValue(amount ?? 0), type],
            onSuccess,
            onError,
            (fees) => getTransferDefaultMessage(fees, amount)
        ), [])

    useEffect(() => {
        setIsEstimatingTransferFee(true);
        estimate(
            tokenContractAddress,
            tokenContractAbi,
            'transfer',
            [walletAddress, 0]
        )
            .then(fee => {
                setTransferFee(fee);
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setIsEstimatingTransferFee(false);
            });
    }, [])

    useEffect(() => {
        return () => {
            setTransferFee(undefined);
            setIsEstimatingTransferFee(false);
        }
    }, [])

    useEffect(() => {
        setError(undefined)
    }, [executing])

    return {
        transferToken,
        transferNative,
        transferTokensToOwner,
        isEstimatingTransferFee,
        transferFee,
        executing,
        error
    }
}

export default useBlockchainTransfer;