import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { appConfig } from "../constants/appConfig";
import { contractsAbi } from "../constants/contractsAbis";
import { ERC20Asset } from "../models/assets/ERC20Asset";
import { UserLoyaltyProgram } from "../models/loyaltyProgram";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
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
    const [originOptions, setOriginOptions] = useState<ERC20Asset[]>([]);
    const [destinationOptions, setDestinationOptions] = useState<UserLoyaltyProgram[]>([]);
    const { run } = useCloud();
    const { defaultProgram } = useLoyaltyPrograms();
    const { defaultAsset } = useERC20Assets();
    const { presentFailure, presentSuccess } = useToast();
    const { helpers } = useBlockchain();

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
                console.error(error)
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

    useEffect(() => {
        setOriginOptions(defaultAsset ? [defaultAsset] : []);
        setDestinationOptions(defaultProgram ? [defaultProgram] : []);
    }, [defaultAsset, defaultProgram])

    useEffect(() => {
        simulateT2PExchange(
            tokenQuantity ?? 0,
            (result) => {
                console.log('simulation result is ', result);
                setProgramQuantity(result);
            })
    }, [tokenQuantity])

    return {
        exchange: executeT2PExchange,
        originOptions: originOptions,
        destinationOptions: destinationOptions,
        originToken: defaultAsset,
        originTokenQuantity: tokenQuantity,
        setOriginTokenQuantity: setTokenQuantity,
        destinationProgram: defaultProgram,
        destinationProgramQuantity: programQuantity,
        exchanging: exchanging
    }
}

export default useTokenProgramsExchange;