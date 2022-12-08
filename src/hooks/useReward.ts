import { useState } from "react";
import { cloudFunctionName } from "../constants/cloudFunctionName";
import useCloud from "./useCloud";
import { Reward } from "../models/reward";
import { RewardDTO } from "../dto/RewardDTO";
import { KeyValue } from "../models/keyValue";
import { EarningReward } from "../models/earningReward";
import { EarningRewardDTO } from "../dto/earningRewardDTO";
import { UserEarningDTO } from "../dto/userEarningDTO";
import { UserEarning } from "../models/userEarning";

const useReward = () => {
    const [ rewards, setRewards ] = useState<Reward[]>([])
    const [ earningRewards, setEarningRewards ] = useState<EarningReward[]>([])
    const [ userEarningsList, setUserEarningsList ] = useState<string[]>([])
    const [ isLoadingRewards, setIsLoadingRewards ] = useState(false);
    const [ isLoadingEarnings, setIsLoadingEarnings ] = useState(false);
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
            .finally(() => setIsLoadingSubmission(false))
    }

    function getRewards() {
        fetchRewards().then(rewards => {
            if (rewards) setRewards(rewards)
        })
    }

    async function fetchEarnings() {
        setIsLoadingEarnings(true)
        return run(cloudFunctionName.earningActions,
            null,
            (result: EarningRewardDTO[]) => result.map(earn => EarningReward.getFromDTO(earn)),
            true)
            .then(result => {
                if (result.isSuccess) return result.data
            })
            .finally(() => setIsLoadingEarnings(false))
    }

    function getEarningRewards() {
        fetchEarnings().then(earnings => {
            if (earnings) setEarningRewards(earnings)
        })
    }

    async function fetchUserEarnings() {
        return run(cloudFunctionName.userEarnings,
            null,
            (result: UserEarningDTO[]) => result.map(earn => UserEarning.getFromDTO(earn)),
            true)
            .then(result => {
                if (result.isSuccess) return result.data
            })
    }
    function getUserEarnings() {
        fetchUserEarnings().then(earnings => {
            if (earnings) {
                let userEarningList: string[] = []
                earnings.forEach((earning) => {
                    userEarningList.push(earning.earningActionId)
                })
                setUserEarningsList(userEarningList)
            }
        })
    }

    return {
        rewards,
        earningRewards,
        userEarningsList,
        getRewards,
        getEarningRewards,
        getUserEarnings,
        claimReward,
        fetchEarnings,
        isLoadingEarnings,
        isLoadingSubmission,
        isLoadingRewards
    }
}

export default useReward;