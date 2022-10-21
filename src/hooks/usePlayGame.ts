import { useState } from "react";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import { useDapp } from "../providers/DappProvider/DappProvider";

const usePlayGame = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [errorInSpin, setErrorInSpin] = useState(false)
    const { walletAddress } = useDapp();
    const { run } = useCloud();


    async function play(brand: string) {
        if (!brand && !walletAddress) return;
        return run(cloudFunctionName.playWithSuperPoints,
            {
                brand: brand,
                player_address: walletAddress
            },
            res => res as boolean,
            true)
    }


    return {
        play,
        isPlaying,
        setIsPlaying,
        errorInSpin,
        setErrorInSpin
    }
}

export default usePlayGame;