import { useState } from "react";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import { useDapp } from "../providers/DappProvider/DappProvider";

const usePlayGame = () => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [errorInSpin, setErrorInSpin] = useState(false)
    const { walletAddress } = useDapp();
    const { run } = useCloud();


    async function play(brand: string, partner_id: string) {
        if (!brand && !walletAddress) return;
        let params: any = {
            brand: brand,
            partner_id : partner_id,
            player_address: walletAddress
        }
        if (!partner_id) delete params['partner_id'];
        return run(cloudFunctionName.playWithSuperPoints,
            params
            ,
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