import { useEffect, useState } from "react";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import { useDapp } from "../providers/DappProvider/DappProvider";
import useToast from "./useToast";

const usePlayGame = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string>();
    const { presentFailure } = useToast();
    const { walletAddress } = useDapp();
    const { run } = useCloud();


    async function play(brand: string, partner_id: string) {
        if (!brand && !walletAddress) return;
        setIsPlaying(true);
        let params: any = {
            brand: brand,
            player_address: walletAddress
        }
        if (partner_id) params['partner_id'] = partner_id;
        return run(cloudFunctionName.playWithSuperPoints,
            params
            ,
            res => res as boolean,
            true).then((result) => {
                if (!result?.isSuccess || !result.data) {
                    if(result?.errors) setError(result.errors?.errors[0]?.message)
                    else setError('Server is busy, try again later')
                    setIsPlaying(false);
                    return;
                }
            })
    }

    useEffect(() => {
        if (error) {
            setIsPlaying(false)
            presentFailure(error)
            setError(undefined)
        }
    }, [error])


    return {
        play,
        isPlaying,
        setIsPlaying,
        error,
        setError
    }
}

export default usePlayGame;