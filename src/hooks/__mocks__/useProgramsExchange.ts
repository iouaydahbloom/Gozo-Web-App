import {debounce} from "lodash";
import {useCallback, useEffect, useMemo, useState} from "react";
import {UserLoyaltyProgram} from "../../models/loyaltyProgram";
import {useLoyaltyPrograms} from "../loyaltyProgram/__mocks__/useLoyaltyPrograms";
import useMemberShip from "../membership/__mocks__/useMembership";
import useToast from "../useToast";
import {dummySleeperPromise} from "../../helpers/promiseHelper";
import {act} from "@testing-library/react";

export interface ExchangeState {
    loyaltyCurrency: string,
    quantity?: number
}

const useProgramsExchange = () => {
    const [originProgram, setOriginProgram] = useState<ExchangeState>({loyaltyCurrency: '', quantity: 0});
    const [destinationProgram, setDestinationProgram] = useState<ExchangeState>({loyaltyCurrency: '', quantity: 0});
    const [exchanging, setExchanging] = useState(false);
    const [simulating, setSimulating] = useState(false);
    const [exchangeInOptions, setExchangeInOptions] = useState<UserLoyaltyProgram[]>([]);
    const [exchangeOutOptions, setExchangeOutOptions] = useState<UserLoyaltyProgram[]>([]);
    const [optionsReady, setOptionsReady] = useState(false);
    const [defaultExchangeOptions, setDefaultExchangeOptions] = useState<UserLoyaltyProgram[]>([]);
    const {fetchMyLoyaltyPrograms, defaultProgram} = useLoyaltyPrograms();
    const {presentSuccess} = useToast();
    const [direction, setDirection] = useState<'p2s' | 's2p'>('p2s');
    const {membership} = useMemberShip(originProgram.loyaltyCurrency);

    const executeP2PExchange = useCallback(async (from: string, to: string, amount: number) => {
        if (amount <= 0) return;
        setExchanging(true);
        return dummySleeperPromise(true, 'resolve')
            .then(() => {
                presentSuccess('Swapped successfully');
            })
            .finally(() => setExchanging(false))
    }, [originProgram.loyaltyCurrency])

    const simulateP2PExchange = useCallback(debounce(
        (from: string, to: string, amount: number, onSuccess: (result: number) => void) => {
            if (!amount) {
                onSuccess(0);
                return;
            }
            setSimulating(true);
            //dummySleeperPromise(2000, 'resolve')
            return Promise.resolve(2000)
                .then(result => {
                    onSuccess(result);
                })
                .finally(() => setSimulating(false))
        }, 1000), [])

    function updateSelections() {
        if (direction === 'p2s') {
            setOriginProgram({loyaltyCurrency: exchangeInOptions[0].currency.loyaltyCurrency!, quantity: 0})
            setDestinationProgram({loyaltyCurrency: defaultProgram!.currency.loyaltyCurrency!, quantity: 0})
        } else {
            setOriginProgram({loyaltyCurrency: defaultProgram!.currency.loyaltyCurrency!, quantity: 0})
            setDestinationProgram({loyaltyCurrency: exchangeOutOptions[0].currency.loyaltyCurrency, quantity: 0})
        }
    }

    function canUpdateSelection() {
        return direction === 'p2s' ?
            exchangeInOptions.length > 0 && (exchangeOutOptions.length > 0 || !!defaultProgram) :
            exchangeOutOptions.length > 0 && (exchangeInOptions.length > 0 || !!defaultProgram);
    }

    const isDirectionSwitchingEnabled = useMemo(() => {
        //console.log('exchangeInOptions', exchangeInOptions)
        //console.log('exchangeOutOptions', exchangeOutOptions)
        if (exchangeInOptions.length === 0 && exchangeOutOptions.length === 0) {
            return false;
        }

        return direction === 'p2s' ?
            exchangeOutOptions.length > 0 && (exchangeInOptions.length > 0 || !!defaultProgram) :
            exchangeInOptions.length > 0 && (exchangeOutOptions.length > 0 || !!defaultProgram)
    }, [direction, exchangeInOptions, exchangeOutOptions, defaultProgram])

    const originBalance = useMemo(() => {
        return membership?.balance ?? 0
    }, [membership?.balance])

    const isDisabled = useMemo(() => {
        const isDisabled = !originProgram.loyaltyCurrency || !originProgram.quantity ||
            originProgram.quantity === 0 || originProgram.quantity > originBalance ||
            !destinationProgram.loyaltyCurrency;
        return isDisabled;
    }, [originProgram.quantity, originProgram.loyaltyCurrency, destinationProgram.loyaltyCurrency, originBalance])

    useEffect(() => {
        setDefaultExchangeOptions(defaultProgram ? [defaultProgram] : []);

        fetchMyLoyaltyPrograms()
            .then(programs => {
                act(() => setExchangeInOptions(programs.filter(program => program.currency.isRedemption)));
                act(() => setExchangeOutOptions(programs.filter(program => program.currency.isExchangeIn)));
                act(() => setOptionsReady(true));
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
        if (!optionsReady) {
            return;
        }

        if (!canUpdateSelection()) {
            setDirection(prev => prev === 's2p' ? 'p2s' : 's2p');
            return;
        }

        updateSelections();
    }, [direction, optionsReady])

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
        originBalance,
        isDirectionSwitchingEnabled
    }
}

export default useProgramsExchange;