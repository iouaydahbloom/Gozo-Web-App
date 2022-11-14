import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";
import { ERC20Asset } from "../models/assets/ERC20Asset";
import { NativeAsset } from "../models/assets/NativeAsset";
import { UserLoyaltyProgram } from "../models/loyaltyProgram";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { useDapp } from "../providers/DappProvider/DappProvider";
import useBlockchainContractExecution from "./useBlockchainContractExecution";
import useCloud from "./useCloud";
import useCryptoAssets from "./useCryptoAssets";
import useLoyaltyPrograms from "./useLoyaltyPrograms";
import useMemberShip from "./useMembership";
import useToast from "./useToast";

export enum SwapPartyType {
    loyaltyProgram,
    nativeCryptoCurrency
}

export const NATIVE_CRYPTO_IDENTIFIER = 'native-crypto-ID';

interface OtherSwapParty {
    id: string,
    quantity?: number,
    type: SwapPartyType
}

const useTokenToOthersExchange = () => {
    const [tokenQuantity, setTokenQuantity] = useState<number | undefined>(0);
    const [selectedOthers, setSelectedOthers] = useState<OtherSwapParty>({ id: '', quantity: 0, type: SwapPartyType.loyaltyProgram });
    const [exchanging, setExchanging] = useState(false);
    const [simulating, setSimulating] = useState(false);
    const [tokenOptions, setTokenOptions] = useState<ERC20Asset[]>([]);
    const [othersOptions, setOthersOptions] = useState<(UserLoyaltyProgram | NativeAsset)[]>([]);
    const { defaultProgram } = useLoyaltyPrograms();
    const { defaultERC20Asset, defaultNativeAsset, fetchCryptoAssets } = useCryptoAssets();
    const { walletAddress, tokenContractAddress, tokenContractAbi } = useDapp();
    const [minimumValue, setMinimumValue] = useState<number>();
    const [estimatedGasFee, setEstimatedGasFee] = useState<number>();
    const [isEstimatingGasFee, setIsEstimatingGasFee] = useState(false);
    const [direction, setDirection] = useState<'t2o' | 'o2t'>('t2o');
    const { membership } = useMemberShip(defaultProgram?.currency.loyaltyCurrency);
    const { Moralis } = useMoralis();
    const { run } = useCloud();
    const { presentFailure, presentSuccess } = useToast();

    const tokenQuantityInWei = useMemo(() => {
        return Moralis.Units.Token(tokenQuantity ?? 0, 18);
    }, [tokenQuantity])

    const { execute: transferTokens, estimate, executing } = useBlockchainContractExecution();

    /**
     * Token to points exchange logic
     */
    const executeT2OExchange = useCallback(async () => {
        if (tokenQuantity && tokenQuantity <= 0) return;

        return transferTokens(
            tokenContractAddress,
            tokenContractAbi,
            'transferToOwner',
            [tokenQuantityInWei, selectedOthers.type],
            () => presentSuccess('Exchanged successfully'),
            (error) => presentFailure(error.message)
        );
    }, [tokenQuantity, selectedOthers.type])

    const simulateTokenToOthersExchange = useCallback(debounce((amount: number, onSuccess: (result: number) => void) => {
        if (!amount || !selectedOthers) { onSuccess(0); return; }
        setSimulating(true);
        const fn = selectedOthers.type == SwapPartyType.loyaltyProgram ?
            cloudFunctionName.simulateT2PExchange :
            cloudFunctionName.simulateT2NativeExchange;

        run(
            fn,
            { amount: amount },
            (result: any) => result as number,
            true
        )
            .then(result => {
                if (result.isSuccess) onSuccess(result.data);
                else {
                    onSuccess(0)
                }
            })
            .finally(() => setSimulating(false))
    }, 1000), [selectedOthers.type])

    const minimumTokenToOthersExchange = useCallback(() => {
        run(
            cloudFunctionName.minimumT2Pexchange,
            null,
            (result: any) => result as number,
            true
        )
            .then(result => {
                if (result.isSuccess) setMinimumValue(result.data);
            })
    }, [])

    const estimateTokenTransferFee = useCallback(async () => {
        try {
            setIsEstimatingGasFee(true);
            const estimatedGasFee = await estimate(
                tokenContractAddress,
                tokenContractAbi,
                'transferToOwner',
                [0, SwapPartyType.loyaltyProgram]
            );
            setEstimatedGasFee(estimatedGasFee);
        }
        catch (error: any) {
            presentFailure(error.message);
        }
        finally {
            setIsEstimatingGasFee(false)
        }
    }, [])

    /**
    * Points to Tokens exchange logic
    */
    const executeP2TExchange = useCallback(async () => {
        if (selectedOthers && selectedOthers.quantity && selectedOthers.quantity <= 0) return;
        setExchanging(true);
        run(
            cloudFunctionName.executeP2Texchange,
            { recipient: walletAddress, amount: selectedOthers?.quantity },
            (result: any) => result as number,
            true
        )
            .then(result => {
                if (result.isSuccess) presentSuccess('Exchanged successfully');
                else presentFailure(result.errors?.errors[0].message ?? result.message);
            })
            .finally(() => setExchanging(false))
    }, [selectedOthers])

    const simulateP2TExchange = useCallback(debounce((amount: number, onSuccess: (result: number) => void) => {
        if (!amount) { onSuccess(0); return; }

        setSimulating(true);
        run(
            cloudFunctionName.simulateP2TExchange,
            { amount: amount },
            (result: any) => result as number
        )
            .then(result => {
                if (result.isSuccess) onSuccess(result.data);
                else {
                    onSuccess(0)
                }
            })
            .finally(() => setSimulating(false))
    }, 1000), [])

    const minimumP2TExchange = useCallback(() => {
        run(
            cloudFunctionName.minimumP2Texchange,
            null,
            (result: any) => result as number,
            true
        )
            .then(result => {
                if (result.isSuccess) setMinimumValue(result.data);
            })
    }, [])

    const isDisabled = useMemo(() => {
        if (direction == 't2o') {
            if (!tokenQuantity) return true;
            return (minimumValue && (tokenQuantity! < minimumValue)) || !tokenQuantity || tokenQuantity == 0;
        }
        return (minimumValue && (selectedOthers?.quantity! < minimumValue)) || !selectedOthers?.quantity;
    }, [tokenQuantity, selectedOthers, minimumValue])

    /**
     * Lifecycles events
     */
    useEffect(() => {
        fetchCryptoAssets();
    }, [])

    useEffect(() => {
        setTokenOptions(defaultERC20Asset ? [defaultERC20Asset] : []);
    }, [defaultERC20Asset])

    useEffect(() => {
        if (direction == 't2o' && defaultProgram && defaultNativeAsset) {
            setOthersOptions([defaultProgram, defaultNativeAsset]);
            //Set default others
            setSelectedOthers({
                id: defaultProgram.currency.loyaltyCurrency,
                quantity: 0,
                type: SwapPartyType.loyaltyProgram
            });
        }
        else if (defaultProgram) {
            setOthersOptions([defaultProgram]);
            //Set default others
            setSelectedOthers({
                id: defaultProgram.currency.loyaltyCurrency,
                quantity: 0,
                type: SwapPartyType.loyaltyProgram
            });
        }
    }, [defaultNativeAsset, defaultProgram, direction])

    useEffect(() => {
        if (direction == 't2o') {
            simulateTokenToOthersExchange(
                tokenQuantity ?? 0,
                (result) => {
                    if (selectedOthers.id) setSelectedOthers({ ...selectedOthers, quantity: result });
                })
        }
    }, [tokenQuantity, direction, selectedOthers.id])

    useEffect(() => {
        if (direction == 'o2t') {
            simulateP2TExchange(
                selectedOthers?.quantity ?? 0,
                (result) => {
                    setTokenQuantity(result);
                })
        }
    }, [selectedOthers?.quantity, direction])

    useEffect(() => {
        setExchanging(executing);
    }, [executing])

    useEffect(() => {
        if (direction == 't2o') {
            minimumTokenToOthersExchange();
            estimateTokenTransferFee();
        } else {
            minimumP2TExchange();
        }
    }, [direction])

    return {
        tokenOptions: tokenOptions,
        othersOptions: othersOptions,
        token: defaultERC20Asset,
        tokenQuantity: tokenQuantity,
        program: defaultProgram,
        selectedOthers,
        exchanging: exchanging,
        simulating,
        direction: direction,
        minimumValue,
        estimatedGasFee,
        isEstimatingGasFee,
        isDisabled,
        pointsBalance: membership?.balance,
        tokensBalance: defaultERC20Asset ? parseFloat(Moralis.Units.FromWei(defaultERC20Asset?.balance, 18)) : 0,
        setSelectedOthers,
        setTokenQuantity: setTokenQuantity,
        toggleDirection: () => setDirection(prev => prev == 't2o' ? 'o2t' : 't2o'),
        exchange: direction == 't2o' ? executeT2OExchange : executeP2TExchange,
    }
}

export default useTokenToOthersExchange;