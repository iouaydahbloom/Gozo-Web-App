import {useCallback, useEffect, useState} from "react";
import {cloudFunctionName} from "../constants/cloudFunctionName";
import useCloud from "./useCloud";
import {useDapp} from "../providers/DappProvider/DappProvider";
import useToast from "./useToast";
import {PlayGame} from "../models/playGame";
import {PlayGameDTO} from "../dto/PlayGameDTO";
import useDataMutation from "./queryCaching/useDataMutation";
import {membershipQueriesIdentity} from "./membership/membershipQueriesIdentity";

interface Props {
    loyaltyProgramId: string,
    partnerId: string,
    brand: string,
    gameToken?: string
}

const usePlayGame = ({loyaltyProgramId, partnerId, brand, gameToken}: Props) => {

    const {presentFailure} = useToast();
    const {walletAddress} = useDapp();
    const [playingError, setPlayingError] = useState<string>();
    const {run} = useCloud();

    const playingMutation = useDataMutation({
        mutatedIdentity: membershipQueriesIdentity.info(loyaltyProgramId),
        fn: () => play()
    })

    const play = useCallback(() => {
        setPlayingError(undefined);
        if (!brand && !walletAddress) return Promise.resolve();
        const params: any = {
            brand: brand,
            player_address: walletAddress
        }
        if (partnerId) params.partner_id = partnerId;
        if (gameToken) params.game_token = gameToken;

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
    }, [partnerId, gameToken, brand, loyaltyProgramId])

    useEffect(() => {
        if (playingError) {
            presentFailure(playingError);
        }
    }, [playingError])

    return {
        play: () => playingMutation.mutateAsync({}),
        isSubmitting: playingMutation.isLoading,
        playingError
    }
}

export default usePlayGame;