import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { UserLoyaltyProgram } from "../models/loyaltyProgram";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import useLoyaltyPrograms from "./useLoyaltyPrograms";
import useToast from "./useToast";

export interface ExchangeState {
    loyaltyCurrency: string,
    quantity?: number
}

const useProgramsExchange = () => {
    const [originProgram, setOriginProgram] = useState<ExchangeState>({ loyaltyCurrency: '', quantity: 0 });
    const [destinationProgram, setDestinationProgram] = useState<ExchangeState>({ loyaltyCurrency: '', quantity: 0 });
    const [exchanging, setExchanging] = useState(false);
    const [simulating, setSimulating] = useState(false);
    const [exchangeInOptions, setExchangeInOptions] = useState<UserLoyaltyProgram[]>([]);
    const [exchangeOutOptions, setExchangeOutOptions] = useState<UserLoyaltyProgram[]>([]);
    const [defaultExchangeOptions, setDefaultExchangeOptions] = useState<UserLoyaltyProgram[]>([]);
    const { run } = useCloud();
    const { fetchMyLoyaltyPrograms, defaultProgram } = useLoyaltyPrograms();
    const { presentFailure, presentSuccess } = useToast();
    const [direction, setDirection] = useState<'p2s' | 's2p'>('p2s');

    const executeP2PExchange = useCallback(async (from: string, to: string, amount: number) => {
        if (amount <= 0) return;
        setExchanging(true);
        return run(cloudFunctionName.executeP2PExchange,
            { origin_loyalty_currency: from, destination_loyalty_currency: to, amount: amount },
            () => true,
            true)
            .then(result => {
                result.isSuccess ?
                    presentSuccess('Swapped successfully') :
                    presentFailure(result.errors?.errors[0].message ?? result.message);
            })
            .finally(() => setExchanging(false))
    }, [])

    const simulateP2PExchange = useCallback(debounce(
        (from: string, to: string, amount: number, onSuccess: (result: number) => void) => {
            if (!amount) {
                onSuccess(0);
                return;
            }
            setSimulating(true);
            run(cloudFunctionName.simulateP2PExchange,
                { origin_loyalty_currency: from, destination_loyalty_currency: to, amount: amount },
                (result: any) => result[to] as number,
                true)
                .then(result => {
                    if (result.isSuccess) onSuccess(result.data);
                    else presentFailure('Unable to simulate conversion');
                })
                .finally(() => setSimulating(false))
        }, 1000), [])

    function updateSelections() {
        if (!checkShufflingEnable()) return;

        if (direction == 'p2s') {
            setOriginProgram({ loyaltyCurrency: exchangeInOptions[0].currency.loyaltyCurrency!, quantity: 0 })
            setDestinationProgram({ loyaltyCurrency: defaultProgram!.currency.loyaltyCurrency!, quantity: 0 })
        }
        else {
            setOriginProgram({ loyaltyCurrency: defaultProgram!.currency.loyaltyCurrency!, quantity: 0 })
            setDestinationProgram({ loyaltyCurrency: exchangeOutOptions[0].currency.loyaltyCurrency, quantity: 0 })
        }
    }

    function checkShufflingEnable() {
        return exchangeInOptions.length > 0 && exchangeOutOptions.length > 0 && !!defaultProgram
    }

    useEffect(() => {
        setDefaultExchangeOptions(defaultProgram ? [defaultProgram] : []);

        fetchMyLoyaltyPrograms()
            .then(programs => {
                setExchangeInOptions(programs.filter(prog => prog.currency.isRedemption));
                setExchangeOutOptions(programs.filter(prog => prog.currency.isExchangeIn));
            })
    }, [])

    useEffect(() => {
        if (originProgram.loyaltyCurrency && destinationProgram.loyaltyCurrency) {
            simulateP2PExchange(originProgram.loyaltyCurrency,
                destinationProgram.loyaltyCurrency,
                originProgram.quantity ?? 0,
                (result) => {
                    setDestinationProgram({ ...destinationProgram, quantity: result })
                });
        }
    }, [originProgram.loyaltyCurrency, originProgram.quantity, destinationProgram.loyaltyCurrency])

    useEffect(() => {
        updateSelections();
    }, [direction, exchangeInOptions, exchangeOutOptions, defaultProgram])

    return {
        exchange: () => executeP2PExchange(originProgram.loyaltyCurrency, destinationProgram.loyaltyCurrency, originProgram.quantity ?? 0),
        exchangeInOptions,
        exchangeOutOptions,
        defaultExchangeOptions,
        originProgram: originProgram,
        setOriginProgram: setOriginProgram,
        destinationProgram: destinationProgram,
        setDestinationProgram: setDestinationProgram,
        exchanging: exchanging,
        simulating,
        direction: direction,
        isDisabled: !originProgram.quantity || originProgram.quantity == 0,
        toggleDirection: () => setDirection(prev => prev == 's2p' ? 'p2s' : 's2p')
    }
}

export default useProgramsExchange;