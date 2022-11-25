import { useCallback, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useDapp } from '../providers/DappProvider/DappProvider';
import useBlockchainContractExecution from './useBlockchainContractExecution';
import useToast from './useToast';
import { ethers } from 'ethers';

const useBlockchainTransfer = () => {

    const { Moralis } = useMoralis();
    const { execute, estimate, executing, signer } = useBlockchainContractExecution();
    const { presentSuccess } = useToast();
    const [transferFee, setTransferFee] = useState<number>();
    const [isEstimatingTransferFee, setIsEstimatingTransferFee] = useState(false);
    const { walletAddress, tokenContractAddress, tokenContractAbi } = useDapp();
    const [error, setError] = useState<Error>();

    const transferNative = useCallback(async (recipient: string, amount: number) => {
        try {
            const tx = await signer.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(amount.toString()),
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
        [receiver, amount != "" ? Moralis.Units.Token(amount) : 0],
        () => presentSuccess('Successfully Transfered'),
        (error) => setError(error.message)
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

    return {
        transferToken,
        transferNative,
        isEstimatingTransferFee,
        transferFee,
        executing,
        error
    }
}

export default useBlockchainTransfer;