import useMagicAuth from "./useMagicAuth";
import { ethers } from 'ethers';
import { useState } from "react";
import { GSNConfig, RelayProvider } from '@opengsn/provider';
import { appConfig } from "../constants/appConfig";
import { useIonViewDidLeave } from "@ionic/react";

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
    const [eventName, setEventName] = useState('');
    const contract = new ethers.Contract(contractAddress, abi, getProviderSigner())

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

    async function initListener(eventName: string, callBack: (...args: any[]) => void) {
        setEventName(eventName)
        contract.on(eventName, callBack);
    }

    useIonViewDidLeave(() => {
        //remove all contract listeners
        contract.removeAllListeners(eventName)
    },[eventName])

    return {
        run,
        initListener,
        error,
        executing
    }
}

export default useBlockchainContractExecution;