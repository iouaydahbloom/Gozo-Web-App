import {useCallback, useEffect, useState} from "react";
import {cloudFunctionName} from "../constants/cloudFunctionName";
import useCloud from "./useCloud";
import {useDapp} from "../providers/DappProvider/DappProvider";
import useToast from "./useToast";
import {PlayGame} from "../models/playGame";
import {PlayGameDTO} from "../dto/PlayGameDTO";
import useDataMutation from "./queryCaching/useDataMutation";
import {membershipQueriesIdentity} from "./membership/membershipQueriesIdentity";
import { prizeQueriesIdentity } from "./gamePrizes/prizeQueriesIdentity";

interface Props {
    loyaltyCurrency?: string,
    brand: string,
    numberOfSpins: number,
    gameToken?: string,
    uncollectedCreditsCount?: number
}

const usePlayGame = ({loyaltyCurrency, brand, gameToken, numberOfSpins, uncollectedCreditsCount}: Props) => {

    const {presentFailure} = useToast();
    const {walletAddress} = useDapp();
    const [playingError, setPlayingError] = useState<string>();
    const {run} = useCloud();

    const playingMutation = useDataMutation({
        mutatedIdentity: uncollectedCreditsCount ? prizeQueriesIdentity.loyaltyCurrency(loyaltyCurrency) : membershipQueriesIdentity.info(loyaltyCurrency),
        fn: () => uncollectedCreditsCount ? playWithCredits() : play()
    })

    const play = useCallback(() => {
        setPlayingError(undefined);
        if (!brand && !walletAddress) return Promise.resolve();
        const params: any = {
            brand: brand,
            player_address: walletAddress
        }
        if (gameToken) params.game_token = gameToken;
        if(numberOfSpins) params.number_of_prizes = numberOfSpins

        return run(cloudFunctionName.playWithSuperPoints,
            params,
            (res: PlayGameDTO) => PlayGame.getFromDTO(res),
            true)
            .then((result) => {
                if (!result.isSuccess) {
                    let errorMessage = '';
                    if (result?.errors) errorMessage = result.errors?.errors[0]?.message;
                    else errorMessage = 'Server is busy, try again later';
                    setPlayingError(errorMessage);
                    return;
                }
            })
    }, [gameToken, brand, numberOfSpins])

    const playWithCredits = useCallback(() => {
        setPlayingError(undefined);
        if (!walletAddress) return Promise.resolve();
        const params: any = {
            player_address: walletAddress
        }
        if (gameToken) params.game_token = gameToken;

        return run(cloudFunctionName.collectReward,
            params,
            (res: PlayGameDTO) => PlayGame.getFromDTO(res),
            true)
            .then((result) => {
                if (result.isSuccess) {
                    return result.data
                } else if(result?.message) {
                    let errorMessage = result.message;
                    setPlayingError(errorMessage);
                    return;
                }
            })
    }, [gameToken])

    useEffect(() => {
        if (playingError) {
            presentFailure(playingError);
        }
    }, [playingError])

    return {
        play: () => playingMutation.mutateAsync({}),
        preWonPrizeId: playingMutation.data?.prizeId,
        isSubmitting: playingMutation.isLoading,
        playingError
    }
}

export default usePlayGame;