import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { UserLoyaltyProgram } from "../models/loyaltyProgram";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import useLoyaltyPrograms from "./useLoyaltyPrograms";
import useToast from "./useToast";

interface ExchangeState {
    loyaltyCurrency: string,
    quantity?: number
}

const useProgramsExchange = () => {
    const [originProgram, setOriginProgram] = useState<ExchangeState>({ loyaltyCurrency: '', quantity: 0 });
    const [destinationProgram, setDestinationProgram] = useState<ExchangeState>({ loyaltyCurrency: '', quantity: 0 });
    const [exchanging, setExchanging] = useState(false);
    const [originOptions, setOriginOptions] = useState<UserLoyaltyProgram[]>([]);
    const [destinationOptions, setDestinationOptions] = useState<UserLoyaltyProgram[]>([]);
    const { run } = useCloud();
    const { fetchMyLoyaltyPrograms, defaultProgram } = useLoyaltyPrograms();
    const { presentFailure, presentSuccess } = useToast();

    const executeP2PExchange = useCallback(async (from: string, to: string, amount: number) => {
        setExchanging(true);
        return run(cloudFunctionName.executeP2PExchange,
            { origin_loyalty_currency: from, destination_loyalty_currency: to, amount: amount },
            () => true,
            true)
            .then(result => {
                if (result.isSuccess) {
                    presentSuccess('Swapped successfuly');
                    return true;
                }
                presentFailure('Unable to execute exchange');
                return false;
            })
            .finally(() => setExchanging(false))
    }, [])

    const simulateP2PExchange = useCallback(_.debounce(
        (from: string, to: string, amount: number, onSuccess: (result: number) => void) => {
            run(cloudFunctionName.simulateP2PExchange,
                { origin_loyalty_currency: from, destination_loyalty_currency: to, amount: amount },
                (result: any) => result[from] as number,
                true)
                .then(result => {
                    if (result.isSuccess) onSuccess(result.data);
                    else presentFailure('Unable to simulate conversion');
                })
        }, 1000), [])

    useEffect(() => {
        setDestinationOptions(defaultProgram ? [defaultProgram] : []);
        fetchMyLoyaltyPrograms()
            .then(result => {
                setOriginOptions(result);
            })
    }, [])

    useEffect(() => {
        if (originProgram.loyaltyCurrency && destinationProgram.loyaltyCurrency) {
            simulateP2PExchange(originProgram.loyaltyCurrency,
                destinationProgram.loyaltyCurrency,
                originProgram.quantity ?? 0,
                (result) => {
                    console.log('simulation result is ', result);
                    setDestinationProgram({ ...destinationProgram, quantity: result })
                });
        }
    }, [originProgram.loyaltyCurrency, originProgram.quantity, destinationProgram.loyaltyCurrency])

    return {
        exchange: () => executeP2PExchange(originProgram.loyaltyCurrency, destinationProgram.loyaltyCurrency, originProgram.quantity ?? 0),
        originOptions: originOptions,
        destinationOptions: destinationOptions,
        originProgram: originProgram,
        setOriginProgram: setOriginProgram,
        destinationProgram: destinationProgram,
        setDestinationProgram: setDestinationProgram,
        exchanging: exchanging
    }
}

export default useProgramsExchange;