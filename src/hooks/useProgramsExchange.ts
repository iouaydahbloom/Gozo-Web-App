import {debounce} from "lodash";
import {useCallback, useEffect, useMemo, useState} from "react";
import {UserLoyaltyProgram} from "../models/loyaltyProgram";
import {cloudFunctionName} from "../constants/cloudFunctionName";
import useCloud from "./useCloud";
import useLoyaltyPrograms from "./loyaltyProgram/useLoyaltyPrograms";
import useMemberShip from "./membership/useMembership";
import useToast from "./useToast";
import useDataMutation from "./queryCaching/useDataMutation";
import {membershipQueriesIdentity} from "./membership/membershipQueriesIdentity";

export interface ExchangeState {
    loyaltyCurrency: string,
    quantity?: number
}

const useProgramsExchange = () => {
    const [originProgram, setOriginProgram] = useState<ExchangeState>({loyaltyCurrency: '', quantity: 0});
    const [destinationProgram, setDestinationProgram] = useState<ExchangeState>({loyaltyCurrency: '', quantity: 0});
    const [simulating, setSimulating] = useState(false);
    const [exchangeInOptions, setExchangeInOptions] = useState<UserLoyaltyProgram[]>([]);
    const [exchangeOutOptions, setExchangeOutOptions] = useState<UserLoyaltyProgram[]>([]);
    const [defaultExchangeOptions, setDefaultExchangeOptions] = useState<UserLoyaltyProgram[]>([]);
    const {run} = useCloud();
    const {defaultProgram, myPrograms} = useLoyaltyPrograms({});
    const {presentFailure, presentSuccess} = useToast();
    const [direction, setDirection] = useState<'p2s' | 's2p'>('p2s');
    const {membership} = useMemberShip(originProgram.loyaltyCurrency);

    const executeExchangeMutation = useDataMutation({
        mutatedIdentity: [
            membershipQueriesIdentity.info(originProgram.loyaltyCurrency),
            membershipQueriesIdentity.info(destinationProgram.loyaltyCurrency),
        ],
        fn: () =>
            executeP2PExchange(
                originProgram.loyaltyCurrency,
                destinationProgram.loyaltyCurrency,
                originProgram.quantity ?? 0
            )
    })

    const executeP2PExchange = useCallback(async (from: string, to: string, amount: number) => {
        if (amount <= 0) return;

        return run(
            cloudFunctionName.executeP2PExchange,
            {origin_loyalty_currency: from, destination_loyalty_currency: to, amount: amount},
            () => true,
            true
        )
            .then(async result => {
                if (result.isSuccess) {
                    presentSuccess('Swapped successfully');
                    return;
                }

                presentFailure(result.errors?.errors[0].message ?? result.message);
            })
    }, [originProgram.loyaltyCurrency])

    const simulateP2PExchange = useCallback(debounce(
        (from: string, to: string, amount: number, onSuccess: (result: number) => void) => {
            if (!amount) {
                onSuccess(0);
                return;
            }
            setSimulating(true);
            run(cloudFunctionName.simulateP2PExchange,
                {origin_loyalty_currency: from, destination_loyalty_currency: to, amount: amount},
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

        if (direction === 'p2s') {
            setOriginProgram({loyaltyCurrency: exchangeInOptions[0].currency.loyaltyCurrency!, quantity: 0})
            setDestinationProgram({loyaltyCurrency: defaultProgram!.currency.loyaltyCurrency!, quantity: 0})
        } else {
            setOriginProgram({loyaltyCurrency: defaultProgram!.currency.loyaltyCurrency!, quantity: 0})
            setDestinationProgram({loyaltyCurrency: exchangeOutOptions[0].currency.loyaltyCurrency, quantity: 0})
        }
    }

    function checkShufflingEnable() {
        return direction === 'p2s' ?
            exchangeInOptions.length > 0 && (exchangeOutOptions.length > 0 || !!defaultProgram) :
            exchangeOutOptions.length > 0 && (exchangeInOptions.length > 0 || !!defaultProgram)
    }

    const isDirectionSwitchingEnabled = useMemo(() => {
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
        return !originProgram.quantity || originProgram.quantity === 0 || originProgram.quantity > originBalance
    }, [originProgram.quantity, originBalance])

    useEffect(() => {
        setExchangeInOptions(myPrograms.filter(program => program.currency.isRedemption));
        setExchangeOutOptions(myPrograms.filter(program => program.currency.isExchangeIn));

        return () => {
            setExchangeInOptions([])
            setExchangeOutOptions([])
        }
    }, [myPrograms])

    useEffect(() => {
        setDefaultExchangeOptions(defaultProgram ? [defaultProgram] : []);
    }, [defaultProgram])

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
        exchange: executeExchangeMutation.mutateAsync,
        exchangeInOptions,
        exchangeOutOptions,
        defaultExchangeOptions,
        originProgram: originProgram,
        setOriginProgram: setOriginProgram,
        destinationProgram: destinationProgram,
        setDestinationProgram: setDestinationProgram,
        exchanging: executeExchangeMutation.isLoading,
        simulating,
        direction: direction,
        isDisabled,
        toggleDirection: () => setDirection(prev => prev === 's2p' ? 'p2s' : 's2p'),
        originBalance,
        isDirectionSwitchingEnabled: isDirectionSwitchingEnabled
    }
}

export default useProgramsExchange;