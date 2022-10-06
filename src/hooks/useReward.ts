import { useState } from "react";
import { cloudFunctionName } from "../moralis/cloudFunctionName";
import useCloud from "./useCloud";
import { Reward } from "../models/reward";
import { RewardDTO } from "../dto/RewardDTO";

const useReward = () => {
    const [ isLoadingRewards, setIsLoadingRewards ] = useState(false);
    const { run } = useCloud();

    async function fetchRewards() {
        setIsLoadingRewards(true)
        return run(cloudFunctionName.reward,
            null,
            (result: RewardDTO[]) => Reward.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) return result.data
            })
            .finally(() => setIsLoadingRewards(false))
    }


    return {
        fetchRewards,
        isLoadingRewards
    }
}

export default useReward;