import useMagicAuth from "./useMagicAuth";
import { ethers } from 'ethers';
import { useState } from "react";
import { GSNConfig, RelayProvider } from '@opengsn/provider';
import { appConfig } from "../constants/appConfig";
import { useIonViewDidLeave, useIonViewWillEnter } from "@ionic/react";
import { signMetaTxRequest } from "../helpers/metaTransactionsSigner";
import { contractsAbi } from "../constants/contractsAbis";
import { DefenderRelaySigner, DefenderRelayProvider } from 'defender-relay-client/lib/ethers';

interface Props {
    contractAddress: string,
    abi: any,
    funct: string,
    params: any[]
}

const useBlockchainContractExecution = ({ contractAddress, abi, funct, params }: Props) => {

    const { rpcProvider, getProviderSigner } = useMagicAuth();
    const [error, setError] = useState();
    const [executing, setExecuting] = useState(false);
    const [eventNames, setEventNames] = useState<string[]>([]);
    const [contract, setContract] = useState<ethers.Contract>()

    async function run(withGSN?: boolean) {
        try {
            setExecuting(true);
            const signer = withGSN ? await getGSNProviderSigner() : getProviderSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);
            let tx: any;
            if (withGSN) {
                tx = await contract[funct](...params);
            } else {
                const gasLimit = await contract.estimateGas[funct](...params);
                tx = await contract[funct](...params, { gasLimit: gasLimit, gasPrice: 25000000000 });
            }
            const receipt = await tx.wait();
            return receipt;
        }
        catch (error: any) {
            setError(error)
        }
        finally {
            setExecuting(false);
        }
    }

    async function getGSNProviderSigner() {
        const config: Partial<GSNConfig> = {
            paymasterAddress: appConfig.paymasterContract,
            relayLookupWindowBlocks: 10000,
            relayRegistrationLookupBlocks: 10000,
            pastEventsQueryMaxPageSize: 2000,
            loggerConfiguration: {
                logLevel: 'debug'
            }
        }

        const provider = await RelayProvider.newProvider({ provider: rpcProvider as any, config }).init();
        const web3Provider = new ethers.providers.Web3Provider(provider as any);
        return web3Provider.getSigner();
    }

    async function addListener(eventName: string, callBack: (...args: any[]) => void) {
        contract && contract.on(eventName, callBack);
        var eventNamesRef = [...eventNames]
        eventNamesRef.push(eventName)
        setEventNames(eventNamesRef)
    }

    useIonViewWillEnter(() => {
        setContract(new ethers.Contract(contractAddress, abi, getProviderSigner()))
    })

    useIonViewDidLeave(() => {
        contract && contract.removeAllListeners()
    }, [eventNames])

    async function sendRelayedTransaction(fn: string, params: any) {
        debugger;
        const credentials = {
            apiKey: '4N8NAjoLUfGFnJ1p9mqk2uHCt8Dx2jFi',
            apiSecret: 'QGxcCiRmMW2J2wjHShKhFDQxXHn9ffyyycMbQtRRyrBMepmvwHBHFtHYaYE81iSX'
        };
        const relayProvider = new DefenderRelayProvider(credentials);
        const relaySigner = new DefenderRelaySigner(credentials, relayProvider, { speed: 'fast' });

        const forwarder = new ethers.Contract(contractAddress, contractsAbi.forwarder, relaySigner);
        const tokenContractInterface = new ethers.utils.Interface(contractsAbi.erc20);

        const { request, signature } = await signMetaTxRequest(rpcProvider, forwarder, {
            from: getProviderSigner()._address,
            to: appConfig.tokenContract,
            data: tokenContractInterface.encodeFunctionData(fn, params)
        });

        const executeTx = await forwarder.execute(request, signature);
        const receipt = await executeTx.wait();
        return receipt;
    }

    return {
        run,
        sendRelayedTransaction,
        error,
        executing
    }
}

export default useBlockchainContractExecution;