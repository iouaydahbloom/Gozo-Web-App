import { useEffect, useState } from "react";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import useCloud from "./useCloud";
import { Reward } from "../models/reward";
import { RewardDTO } from "../dto/RewardDTO";
import { KeyValue } from "../models/keyValue";

const useReward = () => {
    const [ rewards, setRewards ] = useState<Reward[]>([])
    const [ isLoadingRewards, setIsLoadingRewards ] = useState(false);
    const [ isLoadingSubmission, setIsLoadingSubmission ] = useState(false)
    const { run } = useCloud();

    async function fetchRewards() {
        setIsLoadingRewards(true)
        setRewards([])
        return run(cloudFunctionName.reward,
            {
                page: 1,
                page_size: 100
            },
            (result: RewardDTO[]) => result.map(reward => Reward.getFromDTO(reward)),
            true)
            .then(result => {
                if (result.isSuccess) return result.data
            })
            .finally(() => setIsLoadingRewards(false))
    }

    async function claimReward(rewardId: string, fields: KeyValue[]) {
        setIsLoadingSubmission(true)
        return run(cloudFunctionName.claimReward,
            {
                reward_id: rewardId,
                required_data: fields.map(field => field.toDTO())
            },
            (result: any) => result,
            true)
            .then(result => {
                return result
            })
            .finally(() => setIsLoadingSubmission(false))
    }

    function getRewards() {
        fetchRewards().then(rewards => {
            if (rewards) setRewards(rewards)
        })
    }

    return {
        rewards,
        getRewards,
        claimReward,
        isLoadingSubmission,
        isLoadingRewards
    }
}

export default useReward;