import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { appConfig } from "../constants/appConfig";
import { contractsAbi } from "../constants/contractsAbis";
import { ERC20Asset } from "../models/assets/ERC20Asset";
import { UserLoyaltyProgram } from "../models/loyaltyProgram";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import useBlockchain from "./useBlockchain";
import useBlockchainContractExecution from "./useBlockchainContractExecution";
import useCloud from "./useCloud";
import useERC20Assets from "./useERC20Assets";
import useLoyaltyPrograms from "./useLoyaltyPrograms";
import useToast from "./useToast";

const useTokenProgramsExchange = () => {
    const [tokenQuantity, setTokenQuantity] = useState<number>();
    const [programQuantity, setProgramQuantity] = useState<number>();
    const [exchanging, setExchanging] = useState(false);
    const [tokenOptions, setTokenOptions] = useState<ERC20Asset[]>([]);
    const [programOptions, setProgramOptions] = useState<UserLoyaltyProgram[]>([]);
    const { run } = useCloud();
    const { defaultProgram } = useLoyaltyPrograms();
    const { defaultAsset } = useERC20Assets();
    const { presentFailure, presentSuccess } = useToast();
    const { helpers } = useBlockchain();
    const { walletAddress } = useMoralisDapp();
    const [direction, setDirection] = useState<'t2p' | 'p2t'>('t2p');

    const tokenQuantityInWei = useMemo(() => {
        return helpers.Units.Token(tokenQuantity ?? 0, 18);
    }, [tokenQuantity])

    const { run: approveTransfer } = useBlockchainContractExecution({
        contractAddress: appConfig.tokenContract,
        abi: contractsAbi.erc20,
        funct: 'approve',
        params: { spender: appConfig.exchangeContract, amount: tokenQuantityInWei },
        isReadOnly: false
    });

    const { run: transferTokens } = useBlockchainContractExecution({
        contractAddress: appConfig.exchangeContract,
        abi: contractsAbi.exchange,
        funct: 'transferIn',
        params: { _amount: tokenQuantityInWei },
        isReadOnly: false
    });

    const executeT2PExchange = useCallback(async () => {
        setExchanging(true);
        return approveTransfer()
            .then(async (result: any) => {
                await result.wait();
                return transferTokens();
            })
            .then(async (result: any) => {
                await result.wait();
                presentSuccess('Exchanged successfuly');
            })
            .catch(error => {
                presentFailure(`${JSON.stringify(error)}`);
            })
            .finally(() => setExchanging(false))
    }, [tokenQuantity])

    const simulateT2PExchange = useCallback(_.debounce((amount: number, onSuccess: (result: number) => void) => {
        run(cloudFunctionName.simulateT2PExchange, { amount: amount }, (result: any) => result as number, true)
            .then(result => {
                if (result.isSuccess) onSuccess(result.data);
                else presentFailure('Unable to simulate conversion');
            })
    }, 1000), [])

    const executeP2TExchange = useCallback(async () => {
        setExchanging(true);
        run(cloudFunctionName.executeP2Texchange, { recipient: walletAddress, amount: programQuantity }, (result: any) => result as number, true)
            .then(result => {
                if (result.isSuccess) presentSuccess('Exchanged successfuly');
                else presentFailure(result.message);
            })
            .finally(() => setExchanging(false))
    }, [programQuantity])

    const simulateP2TExchange = useCallback(_.debounce((amount: number, onSuccess: (result: number) => void) => {
        run(cloudFunctionName.simulateP2TExchange, { amount: amount }, (result: any) => result as number)
            .then(result => {
                if (result.isSuccess) onSuccess(result.data);
                else presentFailure('Unable to simulate conversion');
            })
    }, 1000), [])

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
        toggleDirection: () => setDirection(prev => prev == 't2p' ? 'p2t' : 't2p')
    }
}

export default useTokenProgramsExchange;