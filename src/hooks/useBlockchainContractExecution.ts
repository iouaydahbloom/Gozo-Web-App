import useMagicAuth from "./useMagicAuth";
import { ethers } from 'ethers';
import { useState } from "react";
import { appConfig } from "../constants/appConfig";
import { useIonViewDidLeave, useIonViewWillEnter } from "@ionic/react";
import { signMetaTxRequest } from "../helpers/metaTransactionsSigner";
import { contractsAbi } from "../constants/contractsAbis";
import { useDapp } from "../providers/DappProvider/DappProvider";
import { useMoralis } from "react-moralis";
import useConfirmation from "./useConfirmation";

const useBlockchainContractExecution = () => {

    const { walletAddress } = useDapp();
    const { rpcProvider, getProviderSigner } = useMagicAuth();
    const [error, setError] = useState();
    const [executing, setExecuting] = useState(false);
    const [contracts, setContracts] = useState<ethers.Contract[]>([])
    const { Moralis } = useMoralis();
    const { confirm } = useConfirmation();

    useIonViewDidLeave(() => {
        contracts?.forEach(contract => {
            contract.removeAllListeners();
        })
    }, [contracts])

    async function sendRelayedRequest(
        contractAddress: string,
        abi: any[],
        fn: string,
        params: any[],
        isEstimating: boolean = false,
        skipFees: boolean = false
    ): Promise<any> {
        const forwarder = new ethers.Contract(appConfig.forwarderContract, contractsAbi.forwarder, getProviderSigner());
        const contractInterface = new ethers.utils.Interface(abi);
        const recipientContract = new ethers.Contract(contractAddress, abi, getProviderSigner());
        const gasLimit = await recipientContract.estimateGas[fn](...params);
        const { request, signature } = await signMetaTxRequest(rpcProvider, forwarder, gasLimit, {
            from: walletAddress,
            to: contractAddress,
            data: contractInterface.encodeFunctionData(fn, params)
        });

        return fetch(appConfig.relayAutoTaskUrl, {
            method: 'POST',
            body: JSON.stringify({ request, signature, skipFees, isEstimating }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(result => result.json())
            .then(response => {
                if (response.status == 'error') {
                    throw new Error(response.message);
                }
                return JSON.parse(response.result);
            });
    }

    async function estimate(contractAddress: string, abi: any[], fn: string, params: any[]): Promise<number> {
        const relayedResult = await sendRelayedRequest(contractAddress, abi, fn, params, true);
        return relayedResult.fees as number;
    }

    async function approvePayingGasFees(contractAddress: string, abi: any[], fn: string, params: any[]) {
        const fees = await estimate(contractAddress, abi, fn, params);
        if (!fees) return;
        //get approval from user to transfer tokens by the relayer as gas fees
        return sendRelayedRequest(
            appConfig.tokenContract,
            contractsAbi.erc20,
            'approve',
            [appConfig.relayerContract, Moralis.Units.Token(fees, 18)],
            false,
            true
        );
    }

    async function execute(
        contractAddress: string,
        abi: any[],
        fn: string,
        params: any[],
        onSuccess?: () => any,
        onError?: (error: any) => any
    ) {
        try {
            setExecuting(true);
            const fees = await estimate(contractAddress, abi, fn, params);
            confirm({
                title: 'Confirmation',
                message: `Transaction fees are ${fees.toString()} GZ tokens, if you are not holding this amount you can't achieve your transaction`,
                onConfirmed: async () => {
                    try {
                        await approvePayingGasFees(contractAddress, abi, fn, params);
                        await sendRelayedRequest(
                            contractAddress,
                            abi,
                            fn,
                            params
                        );
                        onSuccess && onSuccess();
                    }
                    catch (error) {
                        onError && onError(error);
                    }
                    finally {
                        setExecuting(false);
                    }
                },
                onDeclined: () => {
                    setExecuting(false);
                }
            })
        }
        catch (error: any) {
            setError(error.message);
            setExecuting(false);
        }
    }

    async function addListener(contractAddress: string, abi: any[], eventName: string, callBack: (...args: any[]) => void) {
        let contract: ethers.Contract | null = null;
        if (!contracts?.find(ctrct => ctrct.address.toLocaleLowerCase() == contractAddress.toLocaleLowerCase())) {
            contract = new ethers.Contract(contractAddress, abi, getProviderSigner());
            setContracts([...contracts, contract]);
        }
        if (contract) contract.on(eventName, callBack);
    }

    return {
        execute,
        estimate,
        error,
        executing,
        addListener
    }
}

export default useBlockchainContractExecution;