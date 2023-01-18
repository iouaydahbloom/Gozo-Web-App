import {cloudFunctionName} from "../../constants/cloudFunctionName";
import useCloud from "../useCloud";
import {Reward} from "../../models/reward";
import {RewardDTO} from "../../dto/RewardDTO";
import {KeyValue} from "../../models/keyValue";
import {EarningReward} from "../../models/earningReward";
import {EarningRewardDTO} from "../../dto/earningRewardDTO";
import {UserEarningDTO} from "../../dto/userEarningDTO";
import {UserEarning} from "../../models/userEarning";
import useDataQuery from "../queryCaching/useDataQuery";
import {rewardsQueriesIdentity} from "./rewardQueriesIdentity";
import useDataMutation from "../queryCaching/useDataMutation";

const useReward = () => {

    const {run} = useCloud();

    const rewardsQuery = useDataQuery({
        identity: rewardsQueriesIdentity.reward,
        fn: fetchRewards
    })

    const earningsQuery = useDataQuery({
        identity: rewardsQueriesIdentity.earnings,
        fn: fetchEarnings
    })

    const userEarningQuery = useDataQuery({
        identity: rewardsQueriesIdentity.userEarnings,
        fn: fetchUserEarnings
    })

    const claimRewardMutation = useDataMutation({
        mutatedIdentity: rewardsQueriesIdentity.userEarnings,
        fn: claimReward
    })

    async function fetchRewards() {
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
    }

    async function claimReward({rewardId, fields}: { rewardId: string, fields: KeyValue[] }) {
        return run(cloudFunctionName.claimReward,
            {
                reward_id: rewardId,
                required_data: fields.map(field => field.toDTO())
            },
            (result: any) => result,
            true)
    }

    async function fetchEarnings() {
        return run(cloudFunctionName.earningActions,
            null,
            (result: EarningRewardDTO[]) => result.map(earn => EarningReward.getFromDTO(earn)),
            true)
            .then(result => {
                if (result.isSuccess) return result.data
            })
    }

    async function fetchUserEarnings() {
        return run(cloudFunctionName.userEarnings,
            null,
            (result: UserEarningDTO[]) => result.map(earn => UserEarning.getFromDTO(earn)),
            true)
            .then(result => {
                if (result.isSuccess && result.data) {
                    const earnings = result.data;
                    let userEarningList: string[] = []
                    earnings.forEach((earning) => {
                        userEarningList.push(earning.earningActionId)
                    })
                    return userEarningList;
                }
            })
    }

    return {
        rewards: rewardsQuery.data ?? [],
        earningRewards: earningsQuery.data ?? [],
        userEarningsList: userEarningQuery.data ?? [],
        getRewards: rewardsQuery.refetch,
        getEarningRewards: earningsQuery.refetch,
        getUserEarnings: userEarningQuery.refetch,
        claimReward: claimRewardMutation.mutateAsync,
        isLoadingEarnings: earningsQuery.isLoading,
        isLoadingSubmission: claimRewardMutation.isLoading,
        isLoadingRewards: rewardsQuery.isLoading
    }
}

export default useReward;