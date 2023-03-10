import {debounce} from "lodash";
import {useCallback, useEffect, useMemo, useState} from "react";
import {ERC20Asset} from "../models/assets/ERC20Asset";
import {NativeAsset} from "../models/assets/NativeAsset";
import {UserLoyaltyProgram} from "../models/loyaltyProgram";
import {cloudFunctionName} from "../constants/cloudFunctionName";
import {useDapp} from "../providers/DappProvider/DappProvider";
import useBlockchainContractExecution from "./useBlockchainContractExecution";
import useBlockchainTransfer from "./useBlockchainTransfer";
import useCloud from "./useCloud";
import useCryptoAssets from "./cryptoAssets/useCryptoAssets";
import useLoyaltyPrograms from "./loyaltyProgram/useLoyaltyPrograms";
import useMemberShip from "./membership/useMembership";
import useToast from "./useToast";
import {parseNumber} from "../helpers/blockchainHelper";
import useDataQuery from "./queryCaching/useDataQuery";
import useDataMutation from "./queryCaching/useDataMutation";
import {membershipQueriesIdentity} from "./membership/membershipQueriesIdentity";
import {cryptoAssetsQueriesIdentity} from "./cryptoAssets/cryptoAssetsQueriesIdentity";

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
    const [selectedOthers, setSelectedOthers] = useState<OtherSwapParty>({
        id: '',
        quantity: 0,
        type: SwapPartyType.loyaltyProgram
    });
    const [simulating, setSimulating] = useState(false);
    const [tokenOptions, setTokenOptions] = useState<ERC20Asset[]>([]);
    const [othersOptions, setOthersOptions] = useState<(UserLoyaltyProgram | NativeAsset)[]>([]);
    const {defaultProgram} = useLoyaltyPrograms({});
    const {defaultERC20Asset, defaultNativeAsset} = useCryptoAssets();
    const {walletAddress, tokenContractAddress, tokenContractAbi, botWalletAddress} = useDapp();
    const [estimatedGasFee, setEstimatedGasFee] = useState<number>();
    const [isEstimatingGasFee, setIsEstimatingGasFee] = useState(false);
    const [direction, setDirection] = useState<'t2o' | 'o2t'>('t2o');
    const {membership} = useMemberShip(defaultProgram?.currency.loyaltyCurrency);
    const {run} = useCloud();
    const {presentFailure, presentSuccess} = useToast();
    const {estimate} = useBlockchainContractExecution();
    const {transferNative, transferTokensToOwner, executing: executingTransfer, error} = useBlockchainTransfer();

    const minPointsToTokenExchangeQuery = useDataQuery({
        identity: ['minPointsToTokenExchange'],
        fn: () => getMinPointsToTokenExchange()
    })

    const minTokenToPointsExchangeQuery = useDataQuery({
        identity: ['minTokenToPointsExchange'],
        fn: () => getMinTokenToPointsExchange()
    })

    const executeTokenToOthersExchangeMutation = useDataMutation({
        mutatedIdentity: [
            membershipQueriesIdentity.info(defaultProgram?.currency.loyaltyCurrency),
            cryptoAssetsQueriesIdentity.list
        ],
        fn: () => executeTokenToOthersExchange()
    })

    const executeOthersToTokenExchangeMutation = useDataMutation({
        mutatedIdentity: [
            membershipQueriesIdentity.info(defaultProgram?.currency.loyaltyCurrency),
            cryptoAssetsQueriesIdentity.list
        ],
        fn: () => executeOthersToTokenExchange()
    })

    const minimumValue = direction === 't2o' ?
        minTokenToPointsExchangeQuery.data : minPointsToTokenExchangeQuery.data;

    /**
     * Token to others exchange logic
     */
    const executeTokenToOthersExchange = useCallback(async () => {
        if (tokenQuantity && tokenQuantity <= 0) return;

        return transferTokensToOwner(
            tokenQuantity as string | number,
            selectedOthers.type,
            () => {
                presentSuccess('Exchanged successfully');
            },
            (error) => presentFailure(error.message)
        )
    }, [tokenQuantity, selectedOthers.type])

    const simulateTokenToOthersExchange = useCallback(debounce((
        amount: number,
        onSuccess: (result: number) => void
    ) => {
        if (!amount || !selectedOthers) {
            onSuccess(0);
            return;
        }
        setSimulating(true);
        const fn = selectedOthers.type === SwapPartyType.loyaltyProgram ?
            cloudFunctionName.simulateT2PExchange :
            cloudFunctionName.simulateT2NativeExchange;

        run(
            fn,
            {amount: amount},
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

    const getMinTokenToPointsExchange = useCallback(() => {
        return run(
            cloudFunctionName.minimumT2Pexchange,
            null,
            (result: any) => result as number,
            true
        )
            .then(result => {
                return result.isSuccess ? result.data : null;
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
        } catch (error: any) {
            presentFailure(error.message);
        } finally {
            setIsEstimatingGasFee(false)
        }
    }, [])

    /**
     * Others to Tokens exchange logic
     */
    const executeOthersToTokenExchange = useCallback(async () => {
        if (selectedOthers && selectedOthers.quantity && selectedOthers.quantity <= 0) return;

        if (selectedOthers.type === SwapPartyType.loyaltyProgram) {
            return executePointsToTokenExchange();
        }

        return executeNativeToTokenExchange();

    }, [selectedOthers.quantity, selectedOthers.type])

    const simulateOthersToTokenExchange = useCallback(debounce((
        amount: number,
        onSuccess: (result: number) => void
    ) => {
        if (!amount) {
            onSuccess(0);
            return;
        }

        const fn = selectedOthers.type === SwapPartyType.loyaltyProgram ?
            cloudFunctionName.simulateP2TExchange :
            cloudFunctionName.simulateNative2TExchange;
        setSimulating(true);

        run(
            fn,
            {amount: amount},
            (result: any) => result as number
        )
            .then(result => {
                if (result.isSuccess) onSuccess(result.data);
                else {
                    onSuccess(0)
                }
            })
            .finally(() => setSimulating(false))
    }, 1000), [selectedOthers.type])

    const getMinPointsToTokenExchange = useCallback(() => {
        return run(
            cloudFunctionName.minimumP2Texchange,
            null,
            (result: any) => result as number,
            true
        )
            .then(result => {
                return result.isSuccess ? result.data : null;
            })
    }, [])

    async function executeNativeToTokenExchange() {
        return transferNative(botWalletAddress, selectedOthers.quantity!)
            .then(success => {
                if (!success) return;
                return run(
                    cloudFunctionName.handleNativeExchange,
                    {recipient: walletAddress, amount: selectedOthers.quantity},
                    (result: any) => result as number,
                    true
                )
                    .then(result => {
                        if (result.isSuccess) {
                            presentSuccess('Exchanged successfully');
                            return;
                        }

                        presentFailure(result.message);
                    })
            });
    }

    async function executePointsToTokenExchange() {
        return run(
            cloudFunctionName.executeP2Texchange,
            {recipient: walletAddress, amount: selectedOthers?.quantity},
            (result: any) => result as number,
            true
        )
            .then(result => {
                if (result.isSuccess) {
                    presentSuccess('Exchanged successfully');
                    return;
                }

                presentFailure(result.errors?.errors[0].message ?? result.message);
            })
    }

    const tokensBalance = defaultERC20Asset ? parseFloat(parseNumber(defaultERC20Asset?.balance)) : 0;
    const pointsBalance = membership?.balance ?? 0;
    const nativeBalance = defaultNativeAsset ? parseFloat(parseNumber(defaultNativeAsset?.balance)) : 0;

    const originBalance = useMemo(() => {
        if (direction === 't2o') {
            return tokensBalance
        }

        if (selectedOthers.type === SwapPartyType.loyaltyProgram) {
            return pointsBalance;
        }

        return nativeBalance;
    }, [direction, selectedOthers.type, defaultNativeAsset?.balance, defaultERC20Asset?.balance, membership?.balance])

    const isDisabled = useMemo(() => {
        if (direction === 't2o') {
            if (!estimatedGasFee || !tokenQuantity || tokenQuantity > (originBalance - estimatedGasFee)) return true;
            if (selectedOthers.type === SwapPartyType.nativeCryptoCurrency) return false;
            return (minimumValue && (tokenQuantity! < minimumValue)) || !tokenQuantity;
        }

        if (selectedOthers.quantity && selectedOthers.quantity > originBalance) return true;
        if (selectedOthers.type === SwapPartyType.nativeCryptoCurrency) return !selectedOthers.quantity;
        return (minimumValue && (selectedOthers?.quantity! < minimumValue)) || !selectedOthers?.quantity;
    }, [tokenQuantity, selectedOthers, minimumValue, originBalance, estimatedGasFee])

    /**
     * Lifecycles events
     */

    useEffect(() => {
        setTokenOptions(defaultERC20Asset ? [defaultERC20Asset] : []);
    }, [defaultERC20Asset])

    useEffect(() => {
        if (!defaultProgram || !defaultNativeAsset) return;
        setOthersOptions([defaultProgram, defaultNativeAsset]);

        if (!selectedOthers.id) {
            setSelectedOthers({
                id: defaultProgram.currency.loyaltyCurrency,
                quantity: 0,
                type: SwapPartyType.loyaltyProgram
            });
        }

    }, [defaultNativeAsset, defaultProgram])

    useEffect(() => {
        if (direction === 't2o') {
            simulateTokenToOthersExchange(
                tokenQuantity ?? 0,
                (result) => {
                    if (selectedOthers.id) setSelectedOthers({...selectedOthers, quantity: result});
                })
        }
    }, [tokenQuantity, direction, selectedOthers.id])

    useEffect(() => {
        if (direction === 'o2t') {
            simulateOthersToTokenExchange(
                selectedOthers?.quantity ?? 0,
                (result) => {
                    setTokenQuantity(result);
                })
        }
    }, [selectedOthers?.quantity, direction, selectedOthers.id])

    useEffect(() => {
        if (direction === 't2o') {
            estimateTokenTransferFee();
        }
    }, [direction])

    useEffect(() => {
        if (!executingTransfer && error) {
            presentFailure(error.message);
        }
    }, [executingTransfer, error])

    return {
        tokenOptions: tokenOptions,
        othersOptions: othersOptions,
        token: defaultERC20Asset,
        tokenQuantity: tokenQuantity,
        program: defaultProgram,
        selectedOthers,
        exchanging: executeOthersToTokenExchangeMutation.isLoading ||
            executeTokenToOthersExchangeMutation.isLoading ||
            executingTransfer,
        simulating,
        direction: direction,
        minimumValue,
        estimatedGasFee,
        isEstimatingGasFee,
        isDisabled,
        originBalance,
        setSelectedOthers,
        setTokenQuantity: setTokenQuantity,
        toggleDirection: () => setDirection(prev => prev === 't2o' ? 'o2t' : 't2o'),
        exchange: direction === 't2o' ?
            executeTokenToOthersExchangeMutation.mutateAsync :
            executeOthersToTokenExchangeMutation.mutateAsync
    }
}

export default useTokenToOthersExchange;