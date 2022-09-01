import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { ERC20Asset } from "../models/assets/ERC20Asset";
import { UserLoyaltyProgram } from "../models/loyaltyProgram";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useBlockchainTransfer from "./useBlockchainTransfer";
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
    const { send, error } = useBlockchainTransfer(tokenQuantity ?? 0);

    const executeT2PExchange = useCallback(async () => {
        setExchanging(true);
        return send()
            .then(result => {
                if (result.status) {
                    return exchangeToPoints(tokenQuantity ?? 0);
                }
                presentFailure(error?.message!);
                return false;
            })
            .finally(() => setExchanging(false))
    }, [])

    const simulateT2PExchange = useCallback(_.debounce((amount: number, onSuccess: (result: number) => void) => {
        run(cloudFunctionName.simulateT2PExchange, { amount: amount }, (result: any) => result as number, true)
            .then(result => {
                if (result.isSuccess) onSuccess(result.data);
                else presentFailure('Unable to simulate conversion');
            })
    }, 1000), [])

    async function exchangeToPoints(tokensAmount: number) {
        return run(cloudFunctionName.executeT2Pexchange, { amount: tokensAmount }, () => true, true)
            .then(result => {
                if (result.isSuccess) {
                    presentSuccess('Swapped successfuly');
                    return true;
                }
                presentFailure('Unable to execute exchange');
                return false;
            })
    }

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