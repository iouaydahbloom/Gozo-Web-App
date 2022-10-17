import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMoralis } from "react-moralis";
import { appConfig } from "../constants/appConfig";
import { contractsAbi } from "../constants/contractsAbis";
import { ERC20Asset } from "../models/assets/ERC20Asset";
import { UserLoyaltyProgram } from "../models/loyaltyProgram";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { useDapp } from "../providers/DappProvider/DappProvider";
import useBlockchainContractExecution from "./useBlockchainContractExecution";
import useCloud from "./useCloud";
import useERC20Assets from "./useERC20Assets";
import useLoyaltyPrograms from "./useLoyaltyPrograms";
import useToast from "./useToast";

const useTokenProgramsExchange = () => {
    const [tokenQuantity, setTokenQuantity] = useState<number | undefined>(0);
    const [programQuantity, setProgramQuantity] = useState<number>();
    const [exchanging, setExchanging] = useState(false);
    const [tokenOptions, setTokenOptions] = useState<ERC20Asset[]>([]);
    const [programOptions, setProgramOptions] = useState<UserLoyaltyProgram[]>([]);
    const { run } = useCloud();
    const { defaultProgram } = useLoyaltyPrograms();
    const { defaultAsset } = useERC20Assets();
    const { presentFailure, presentSuccess } = useToast();
    const { Moralis } = useMoralis();
    const { walletAddress } = useDapp();
    const [minimumValue, setMinimumValue] = useState<number>();
    const [estimatedGasFee, setEstimatedGasFee] = useState<number>();
    const [direction, setDirection] = useState<'t2p' | 'p2t'>('t2p');

    const tokenQuantityInWei = useMemo(() => {
        return Moralis.Units.Token(tokenQuantity ?? 0, 18);
    }, [tokenQuantity])

    const { execute: transferTokens, estimate, executing } = useBlockchainContractExecution();

    /**
     * Token to points exchange logic
     */

    const executeT2PExchange = useCallback(async () => {
        if (tokenQuantity && tokenQuantity <= 0) return;
        return transferTokens(
            appConfig.tokenContract,
            contractsAbi.erc20,
            'transferToOwner',
            [tokenQuantityInWei],
            () => presentSuccess('Exchanged successfuly'),
            (error) => presentFailure(error.message)
        );
    }, [tokenQuantity])

    const simulateT2PExchange = useCallback(debounce((amount: number, onSuccess: (result: number) => void) => {
        if (!amount) {
            onSuccess(0);
            return;
        }
        run(cloudFunctionName.simulateT2PExchange, { amount: amount }, (result: any) => result as number, true)
            .then(result => {
                if (result.isSuccess) onSuccess(result.data);
                else presentFailure(result.message);
            })
    }, 1000), [])

    const minimumT2PExchange = useCallback(() => {
        run(cloudFunctionName.minimumT2Pexchange, null, (result: any) => result as number, true)
            .then(result => {
                if (result.isSuccess) setMinimumValue(result.data);
            })
    }, [])

    const estimateTokenTransferFee = useCallback(async () => {
        const estimatedGasFee = await estimate(
            appConfig.tokenContract,
            contractsAbi.erc20,
            'transferToOwner',
            [tokenQuantityInWei]
        );
        setEstimatedGasFee(estimatedGasFee);
    }, [])

    /**
    * Points to Tokens exchange logic
    */

    const executeP2TExchange = useCallback(async () => {
        if (programQuantity && programQuantity <= 0) return;
        setExchanging(true);
        run(cloudFunctionName.executeP2Texchange, { recipient: walletAddress, amount: programQuantity }, (result: any) => result as number, true)
            .then(result => {
                if (result.isSuccess) presentSuccess('Exchanged successfuly');
                else presentFailure(result.message ?? result.errors?.errors[0].message);
            })
            .finally(() => setExchanging(false))
    }, [programQuantity])

    const simulateP2TExchange = useCallback(debounce((amount: number, onSuccess: (result: number) => void) => {
        if (!amount) {
            onSuccess(0);
            return;
        }
        run(cloudFunctionName.simulateP2TExchange, { amount: amount }, (result: any) => result as number)
            .then(result => {
                if (result.isSuccess) onSuccess(result.data);
                else presentFailure(result.message);
            })
    }, 1000), [])

    const minimumP2TExchange = useCallback(() => {
        run(cloudFunctionName.minimumP2Texchange, null, (result: any) => result as number, true)
            .then(result => {
                if (result.isSuccess) setMinimumValue(result.data);
            })
    }, [])

    /**
     * Lifecycles events
     */

    useEffect(() => {
        setTokenOptions(defaultAsset ? [defaultAsset] : []);
        setProgramOptions(defaultProgram ? [defaultProgram] : []);
    }, [defaultAsset, defaultProgram])

    useEffect(() => {
        if (direction == 't2p') {
            simulateT2PExchange(
                tokenQuantity ?? 0,
                (result) => {
                    setProgramQuantity(result);
                })
        }
    }, [tokenQuantity, direction])

    useEffect(() => {
        if (direction == 'p2t') {
            simulateP2TExchange(
                programQuantity ?? 0,
                (result) => {
                    setTokenQuantity(result);
                })
        }
    }, [programQuantity, direction])

    useEffect(() => {
        setExchanging(executing);
    }, [executing])

    useEffect(() => {
        if (direction == 't2p') {
            minimumT2PExchange();
            estimateTokenTransferFee();
        } else {
            minimumP2TExchange();
        }
    }, [direction])

    return {
        exchange: direction == 't2p' ? executeT2PExchange : executeP2TExchange,
        tokenOptions: tokenOptions,
        programOptions: programOptions,
        token: defaultAsset,
        tokenQuantity: tokenQuantity,
        setTokenQuantity: setTokenQuantity,
        program: defaultProgram,
        programQuantity: programQuantity,
        setProgramQuantity: setProgramQuantity,
        exchanging: exchanging,
        direction: direction,
        minimumValue,
        estimatedGasFee,
        isDisabled: direction == 't2p' ? !tokenQuantity || tokenQuantity == 0 : !programQuantity || programQuantity == 0,
        toggleDirection: () => setDirection(prev => prev == 't2p' ? 'p2t' : 't2p')
    }
}

export default useTokenProgramsExchange;