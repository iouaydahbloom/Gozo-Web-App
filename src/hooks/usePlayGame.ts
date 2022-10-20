import { useState } from "react";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import { useDapp } from "../providers/DappProvider/DappProvider";
import useToast from "./useToast";

const usePlayGame = () => {
    const [ isPlaying, setIsPlaying ] = useState(false)
    const [errorInSpin, setErrorInSpin] = useState(false)
    const { walletAddress } = useDapp();
    const { run } = useCloud();
    const { presentFailure } = useToast();


    async function play(brand: string) {
        if (!brand && !walletAddress) return;
        return run(cloudFunctionName.playWithSuperPoints,
            { 
                brand: brand ,
                player_address: walletAddress
             },
            (res) => {
                setIsPlaying(res as boolean)
                if(res) {
                    return res
                }
                else {
                    setErrorInSpin(true)
                    presentFailure("Unknown Error")
                }
            },
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