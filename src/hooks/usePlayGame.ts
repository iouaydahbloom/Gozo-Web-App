import { useState } from "react";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import { WheelData } from "../models/wheelData";
import { WheelDataDTO } from "../dto/wheelDataDTO";
import { useDapp } from "../providers/DappProvider/DappProvider";

const usePlayGame = () => {
    const [ isLoadingPrizes, setIsLoadingPrizes ] = useState(false);
    const [ isPlaying, setIsPlaying ] = useState(false)
    const { walletAddress } = useDapp();
    const { run } = useCloud();

    async function fetchPrizes(loyaltyCurrency: string ) {
        if (!loyaltyCurrency) return;
        setIsLoadingPrizes(true);
        return run(cloudFunctionName.groupedPrize,
            { loyalty_currency: loyaltyCurrency },
            (result: WheelDataDTO[]) => WheelData.getFromDTO(result),
            true)
            .then(result => {
                return result.isSuccess ? result.data : null
            })
            .finally(() => setIsLoadingPrizes(false))
    }


    async function play(loyaltyCurrency: string) {
        if (!loyaltyCurrency && !walletAddress) return;
        return run(cloudFunctionName.playWithSuperPoints,
            { 
                loyalty_currency: loyaltyCurrency ,
                player_address: walletAddress
             },
            () => true,
            true)
            .then(result => {
                return (result.isSuccess && result.data) ? setIsPlaying(result.data) : null
            })
    }


    return {
        play,
        fetchPrizes,
        isPlaying,
        setIsPlaying,
        isLoadingPrizes
    }
}

export default usePlayGame;