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
                if (result.isSuccess) {
                    presentSuccess('Swapped successfuly');
                    return true;
                }
                presentFailure(result.message);
                return false;
            })
            .finally(() => setExchanging(false))
    }, [])

    const simulateP2PExchange = useCallback(debounce(
        (from: string, to: string, amount: number, onSuccess: (result: number) => void) => {
            run(cloudFunctionName.simulateP2PExchange,
                { origin_loyalty_currency: from, destination_loyalty_currency: to, amount: amount },
                (result: any) => result[to] as number,
                true)
                .then(result => {
                    if (result.isSuccess) onSuccess(result.data);
                    else presentFailure('Unable to simulate conversion');
                })
        }, 1000), [])

    function shuffleSelections() {
        const origin = { ...originProgram };
        const destination = { ...destinationProgram };

        setOriginProgram(destination)
        setDestinationProgram(origin)
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
        direction: direction,
        toggleDirection: () => {
            setDirection(prev => prev == 's2p' ? 'p2s' : 's2p');
            shuffleSelections();
        }
    }
}

export default useProgramsExchange;