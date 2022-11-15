import { useCallback, useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useDapp } from '../providers/DappProvider/DappProvider';
import useBlockchainContractExecution from './useBlockchainContractExecution';
import useToast from './useToast';
import { ethers } from 'ethers';

const useBlockchainTransfer = () => {

    const { Moralis } = useMoralis();
    const { execute, estimate, executing, signer } = useBlockchainContractExecution();
    const { presentSuccess, presentFailure } = useToast();
    const [transferFee, setTransferFee] = useState<number>();
    const [isEstimatingTransferFee, setIsEstimatingTransferFee] = useState(false);
    const { walletAddress, tokenContractAddress, tokenContractAbi } = useDapp();

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
            presentFailure('Insufficent funds or transaction inner failure');
            return false;
        }
    }, [])

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
                presentFailure(error.message);
            })
            .finally(() => {
                setIsEstimatingTransferFee(false);
            });
    }, [])

    return {
        transfer: (receiver: string, amount: string | number) => execute(
            tokenContractAddress,
            tokenContractAbi,
            'transfer',
            [receiver, amount != "" ? Moralis.Units.Token(amount) : 0],
            () => presentSuccess('Successfully Transfered'),
            (error) => presentFailure(error.message)
        ),
        transferNative,
        isEstimatingTransferFee,
        transferFee,
        executing
    }
}

export default useBlockchainTransfer;