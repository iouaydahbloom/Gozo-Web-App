import {act} from "@testing-library/react";
import {debounce} from "lodash";
import {useCallback, useEffect, useMemo, useState} from "react";
import {UserLoyaltyProgram} from "../../models/loyaltyProgram";
import useLoyaltyPrograms from "../useLoyaltyPrograms/useLoyaltyPrograms";
import useMembership from "../useMembership/useMembership";

export interface ExchangeState {
    loyaltyCurrency: string,
    quantity?: number
}

const useProgramsExchangeMock = () => {

    const [originProgram, setOriginProgram] = useState<ExchangeState>({loyaltyCurrency: '', quantity: 0});
    const [destinationProgram, setDestinationProgram] = useState<ExchangeState>({loyaltyCurrency: '', quantity: 0});
    const [exchanging, setExchanging] = useState(false);
    const [simulating, setSimulating] = useState(false);
    const [exchangeInOptions, setExchangeInOptions] = useState<UserLoyaltyProgram[]>([]);
    const [exchangeOutOptions, setExchangeOutOptions] = useState<UserLoyaltyProgram[]>([]);
    const [defaultExchangeOptions, setDefaultExchangeOptions] = useState<UserLoyaltyProgram[]>([]);
    const [direction, setDirection] = useState<'p2s' | 's2p'>('p2s');
    const {membership} = useMembership(originProgram.loyaltyCurrency);
    const {fetchMyLoyaltyPrograms, defaultProgram} = useLoyaltyPrograms();

    const executeP2PExchange = useCallback(async (from: string, to: string, amount: number) => {
        if (amount <= 0) return;
        setExchanging(true);
        return Promise
            .resolve(true)
            .finally(() => setExchanging(false))
    }, [originProgram.loyaltyCurrency])

    const simulateP2PExchange = useCallback(debounce(
        (from: string, to: string, amount: number, onSuccess: (result: number) => void) => {
            if (!amount) {
                onSuccess(0);
                return;
            }
            setSimulating(true);
            return Promise
                .resolve(true)
                .finally(() => setSimulating(false))
        }, 1000), [])

    function updateSelections() {
        if (!checkShufflingEnable()) return;

        let origin: ExchangeState;
        let destination: ExchangeState;
        if (direction === 'p2s') {
            origin = {loyaltyCurrency: exchangeInOptions[0].currency.loyaltyCurrency!, quantity: 0};
            destination = {loyaltyCurrency: defaultProgram!.currency.loyaltyCurrency!, quantity: 0};
        } else {
            origin = {loyaltyCurrency: defaultProgram!.currency.loyaltyCurrency!, quantity: 0};
            destination = {loyaltyCurrency: exchangeOutOptions[0].currency.loyaltyCurrency, quantity: 0};
        }

        setOriginProgram(origin);
        setDestinationProgram(destination);
    }
    
    function checkShufflingEnable() {
        return direction === 'p2s' ?
            exchangeInOptions.length > 0 && (exchangeOutOptions.length > 0 || !!defaultProgram) :
            exchangeOutOptions.length > 0 && (exchangeInOptions.length > 0 || !!defaultProgram)
    }

    const originBalance = useMemo(() => {
        return membership?.balance ?? 0
    }, [membership?.balance])

    const isDisabled = useMemo(() => {
        return !originProgram.quantity || originProgram.quantity === 0 || originProgram.quantity > originBalance
    }, [originProgram.quantity, originBalance])

    useEffect(() => {
        setDefaultExchangeOptions(defaultProgram ? [defaultProgram] : []);
        fetchMyLoyaltyPrograms()
            .then(programs => {
                act(() => {
                    setExchangeInOptions(programs.filter(program => program.currency.isRedemption));
                    setExchangeOutOptions(programs.filter(program => program.currency.isExchangeIn));
                })
            })
        return () => {
            setExchangeInOptions([])
            setExchangeOutOptions([])
        }
    }, [])

    useEffect(() => {
        if (originProgram.loyaltyCurrency && destinationProgram.loyaltyCurrency) {
            simulateP2PExchange(originProgram.loyaltyCurrency,
                destinationProgram.loyaltyCurrency,
                originProgram.quantity ?? 0,
                (result) => {
                    setDestinationProgram({...destinationProgram, quantity: result})
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
        isDisabled,
        toggleDirection: () => setDirection(prev => prev === 's2p' ? 'p2s' : 's2p'),
        originBalance
    }
}

export default useProgramsExchangeMock;