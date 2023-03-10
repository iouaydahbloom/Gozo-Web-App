import useMagicAuth from "./useMagicAuth";
import {ethers} from 'ethers';
import {useState} from "react";
import {useIonViewDidLeave} from "@ionic/react";
import {useDapp} from "../providers/DappProvider/DappProvider";
import useConfirmation from "./useConfirmation";
import useToast from "./useToast";
import useMetaTransactions from "./useMetaTransactions";
import {parseBlockchainValue} from "../helpers/blockchainHelper";
import useCloud from "./useCloud";
import {cloudFunctionName} from "../constants/cloudFunctionName";

const useBlockchainContractExecution = () => {

    const {walletAddress, tokenContractAddress, tokenContractAbi, relayerContractAddress} = useDapp();
    const {rpcProvider, getProviderSigner} = useMagicAuth();
    const [executing, setExecuting] = useState(false);
    const [contracts, setContracts] = useState<ethers.Contract[]>([]);
    const {confirm} = useConfirmation();
    const {presentInfo} = useToast();
    const {signMetaTxRequest} = useMetaTransactions();
    const {run} = useCloud();

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
        const contractInterface = new ethers.utils.Interface(abi);
        const recipientContract = new ethers.Contract(contractAddress, abi, getProviderSigner());
        const {request, signature} = await signMetaTxRequest(
            rpcProvider,
            getProviderSigner(),
            {
                from: walletAddress ?? '',
                contract: recipientContract,
                contractInterface: contractInterface,
                method: fn,
                params
            });

        return run(
            cloudFunctionName.relayWeb3Request,
            {request, callerSignature: signature, skipFees, isEstimating},
            (res: any) => res,
            true
        ).then((result) => {
            if (!result.isSuccess) throw new Error(result.message);
            return result.data;
        })
    }

    async function estimate(contractAddress: string, abi: any[], fn: string, params: any[]): Promise<number> {
        const relayedResult = await sendRelayedRequest(contractAddress, abi, fn, params, true);
        return relayedResult.fees as number;
    }

    async function approvePayingGasFees(contractAddress: string, abi: any[], fn: string, params: any[], fees: number) {
        if (!fees) return;
        //get approval from user to transfer tokens by the relayer as gas fees
        return sendRelayedRequest(
            tokenContractAddress,
            tokenContractAbi,
            'approve',
            [relayerContractAddress, parseBlockchainValue(fees)],
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
        onError?: (error: any) => any,
        buildCustomConfirmationMessage?: (fees: number) => string
    ) {
        try {
            setExecuting(true);
            const fees = await estimate(contractAddress, abi, fn, params);
            const message = buildCustomConfirmationMessage ?
                buildCustomConfirmationMessage(fees) :
                `Transaction fees are ${fees.toString()} GZ tokens,
            if you are not holding this amount you can't achieve your transaction`;

            return confirm({
                title: 'Confirmation',
                message,
                onConfirmed: async () => {
                    try {
                        presentInfo('Executing Transaction ...');
                        await approvePayingGasFees(contractAddress, abi, fn, params, fees);
                        await sendRelayedRequest(contractAddress, abi, fn, params);
                        onSuccess && onSuccess();
                    } catch (error: any) {
                        onError && onError(error);
                    } finally {
                        setExecuting(false);
                    }
                },
                onDeclined: () => {
                    setExecuting(false);
                }
            })
        } catch (error: any) {
            onError && onError(error);
            setExecuting(false);
        }
    }

    async function addListener(contractAddress: string, abi: any[], eventName: string, callBack: (...args: any[]) => void) {
        let contract = contracts?.find(ctrct => ctrct.address.toLocaleLowerCase() === contractAddress.toLocaleLowerCase());
        if (!contract) {
            contract = new ethers.Contract(contractAddress, abi, getProviderSigner());
            setContracts([...contracts, contract]);
        }

        contract.on(eventName, callBack);
    }

    return {
        execute,
        estimate,
        executing,
        addListener,
        signer: getProviderSigner()
    }
}

export default useBlockchainContractExecution;