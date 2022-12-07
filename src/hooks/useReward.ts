import { useEffect, useState } from "react";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import useCloud from "./useCloud";
import { Reward } from "../models/reward";
import { RewardDTO } from "../dto/RewardDTO";

const useReward = () => {
    const [ rewards, setRewards ] = useState<Reward[]>([])
    const [ isLoadingRewards, setIsLoadingRewards ] = useState(false);
    const { run } = useCloud();

    async function fetchRewards() {
        setIsLoadingRewards(true)
        return run(cloudFunctionName.reward,
            null,
            (result: RewardDTO[]) => result.map(reward => Reward.getFromDTO(reward)),
            true)
            .then(result => {
                if (result.isSuccess) return result.data
            })
            .finally(() => setIsLoadingRewards(false))
    }

    function getRewards() {
        fetchRewards().then(rewards => {
            if (rewards) setRewards(rewards)
        })
    }

    useEffect(() => {
        getRewards()
    }, [])


    return {
        rewards,
        getRewards,
        isLoadingRewards
    }
}

export default useReward;