import { useState } from "react";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import { useDapp } from "../providers/DappProvider/DappProvider";

const usePlayGame = () => {
    const [ isPlaying, setIsPlaying ] = useState(false)
    const { walletAddress } = useDapp();
    const { run } = useCloud();


    async function play(brand: string) {
        if (!brand && !walletAddress) return;
        return run(cloudFunctionName.playWithSuperPoints,
            { 
                brand: brand ,
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
        isPlaying,
        setIsPlaying
    }
}

export default usePlayGame;