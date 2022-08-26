import _ from "lodash";
import { useCallback, useState } from "react";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";

const useExchange = () => {
    const [simulating, setSimulating] = useState(false);
    const [exchanging, setExchanging] = useState(false);
    const { run } = useCloud();

    async function executeP2TExchange(currency: string, amount: number, recipientWallet: string) {
        setExchanging(true);
        return run(cloudFunctionName.executeP2Texchange,
            { recipient: recipientWallet, currency: currency, amount: amount },
            () => true,
            true)
            .then(result => {
                return result.isSuccess
            })
            .finally(() => setExchanging(false))
    }

    async function executeP2PExchange(from: string, to: string, amount: number) {
        setExchanging(true);
        return run(cloudFunctionName.executeP2PExchange,
            { origin_loyalty_currency: to, destination_loyalty_currency: from, amount: amount },
            () => true,
            true)
            .then(result => {
                return result.isSuccess
            })
            .finally(() => setExchanging(false))
    }

    const simulateP2PExchange = useCallback(_.debounce(
        (from: string, to: string, amount: number, onSuccess: (result: number) => void) => {
            setSimulating(true);
            run(cloudFunctionName.simulateP2PExchange,
                { origin_loyalty_currency: to, destination_loyalty_currency: from, amount: amount },
                (result: any) => result[from] as number,
                true)
                .then(result => {
                    if (result.isSuccess) onSuccess(result.data);
                    else alert('Unable to simulate conversion');
                })
                .finally(() => setSimulating(false))
        }, 1000), [])

    const simulateP2TExchange = useCallback(_.debounce(
        (currency: string, amount: number, onSuccess: (result: number) => void) => {
            setSimulating(true);
            run(cloudFunctionName.simulateP2TExchange,
                { currency: currency, amount: amount },
                (result: any) => result[currency] as number,
                true)
                .then(result => {
                    if (result.isSuccess) onSuccess(result.data);
                    else alert('Unable to simulate conversion');
                })
                .finally(() => setSimulating(false))
        }, 1000), [])

    return {
        executeP2TExchange: executeP2TExchange,
        executeP2PExchange: executeP2PExchange,
        simulateP2PExchange: simulateP2PExchange,
        simulateP2TExchange: simulateP2TExchange,
        simulating: simulating,
        exchanging: exchanging
    }
}

export default useExchange;