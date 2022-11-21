import React from 'react'
import { Reward } from '../../../models/reward'
import RewardGrid from '../RewardGrid/RewardGrid'

interface Props {
    rewards: Reward[],
    isLoading: boolean
}

const RewardHistory: React.FC<Props> = ({rewards, isLoading}) => {

    return (
        <RewardGrid
            headers={[
                {
                    text: 'Reward',
                    style: { flex: 0.3 }
                },
                {
                    text: 'Description'
                },
                {
                    text: 'Status',
                    style: { flex: 0.7, }
                }
            ]}
            data={rewards}
            isLoading={isLoading}
        />
    )
}

export default RewardHistory